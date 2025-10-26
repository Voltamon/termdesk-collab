from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import pty
import subprocess
import select
import json
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[Dict]] = {}  # session_id: [{ws, username, has_permission}]
        self.pty_processes: Dict[str, Dict] = {}  # session_id: {master, slave, process}

    async def connect(self, websocket: WebSocket, session_id: str, username: str, is_host: bool):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []
        
        self.active_connections[session_id].append({
            "ws": websocket,
            "username": username,
            "has_permission": is_host,
            "is_host": is_host
        })

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self.active_connections:
            self.active_connections[session_id] = [
                conn for conn in self.active_connections[session_id] 
                if conn["ws"] != websocket
            ]
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]
                # Clean up PTY if exists
                if session_id in self.pty_processes:
                    try:
                        os.close(self.pty_processes[session_id]["master"])
                        self.pty_processes[session_id]["process"].terminate()
                    except:
                        pass
                    del self.pty_processes[session_id]

    async def broadcast(self, session_id: str, message: dict):
        if session_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[session_id]:
                try:
                    await connection["ws"].send_json(message)
                except:
                    disconnected.append(connection)
            
            for conn in disconnected:
                self.disconnect(conn["ws"], session_id)

    def get_members(self, session_id: str) -> List[Dict]:
        if session_id not in self.active_connections:
            return []
        return [{
            "username": conn["username"],
            "has_permission": conn["has_permission"],
            "is_host": conn["is_host"]
        } for conn in self.active_connections[session_id]]

    def update_permission(self, session_id: str, username: str, has_permission: bool):
        if session_id in self.active_connections:
            for conn in self.active_connections[session_id]:
                if conn["username"] == username:
                    conn["has_permission"] = has_permission

    def has_permission(self, session_id: str, username: str) -> bool:
        if session_id in self.active_connections:
            for conn in self.active_connections[session_id]:
                if conn["username"] == username:
                    return conn["has_permission"]
        return False

    def create_pty(self, session_id: str):
        if session_id not in self.pty_processes:
            master, slave = pty.openpty()
            process = subprocess.Popen(
                ["/bin/bash"],
                stdin=slave,
                stdout=slave,
                stderr=slave,
                preexec_fn=os.setsid
            )
            self.pty_processes[session_id] = {
                "master": master,
                "slave": slave,
                "process": process
            }

    def execute_command(self, session_id: str, command: str) -> str:
        if session_id not in self.pty_processes:
            self.create_pty(session_id)
        
        master = self.pty_processes[session_id]["master"]
        
        try:
            os.write(master, (command + "\n").encode())
            
            # Read output with timeout
            output = ""
            timeout = 0.5
            start_time = asyncio.get_event_loop().time()
            
            while asyncio.get_event_loop().time() - start_time < timeout:
                ready, _, _ = select.select([master], [], [], 0.1)
                if ready:
                    try:
                        data = os.read(master, 4096).decode('utf-8', errors='replace')
                        output += data
                    except:
                        break
                else:
                    if output:
                        break
            
            return output
        except Exception as e:
            return f"Error: {str(e)}"

manager = ConnectionManager()

# Models
class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    host_username: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True

class SessionCreate(BaseModel):
    host_username: str

# API Routes
@api_router.post("/sessions", response_model=Session)
async def create_session(input: SessionCreate):
    session = Session(host_username=input.host_username)
    doc = session.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sessions.insert_one(doc)
    return session

@api_router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    session = await db.sessions.find_one({"session_id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

# WebSocket endpoint
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    # Get username and is_host from query params
    username = websocket.query_params.get("username", "Anonymous")
    is_host = websocket.query_params.get("is_host", "false") == "true"
    
    await manager.connect(websocket, session_id, username, is_host)
    
    # Create PTY for host
    if is_host:
        manager.create_pty(session_id)
    
    # Notify all members
    members = manager.get_members(session_id)
    await manager.broadcast(session_id, {
        "type": "member_update",
        "members": members
    })
    
    # Send initial welcome message
    await websocket.send_json({
        "type": "welcome",
        "message": f"Welcome to session {session_id}, {username}!"
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "execute_command":
                command = message["command"]
                requester = message["username"]
                
                # Check permission
                if not manager.has_permission(session_id, requester):
                    await websocket.send_json({
                        "type": "error",
                        "message": "You don't have permission to execute commands"
                    })
                    continue
                
                # Execute command
                output = manager.execute_command(session_id, command)
                
                # Broadcast to all
                await manager.broadcast(session_id, {
                    "type": "terminal_output",
                    "command": command,
                    "output": output,
                    "username": requester
                })
            
            elif message["type"] == "grant_permission":
                if is_host:
                    target_user = message["username"]
                    manager.update_permission(session_id, target_user, True)
                    members = manager.get_members(session_id)
                    await manager.broadcast(session_id, {
                        "type": "member_update",
                        "members": members
                    })
            
            elif message["type"] == "revoke_permission":
                if is_host:
                    target_user = message["username"]
                    manager.update_permission(session_id, target_user, False)
                    members = manager.get_members(session_id)
                    await manager.broadcast(session_id, {
                        "type": "member_update",
                        "members": members
                    })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
        members = manager.get_members(session_id)
        await manager.broadcast(session_id, {
            "type": "member_update",
            "members": members,
            "message": f"{username} left the session"
        })

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()