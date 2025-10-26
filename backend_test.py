import requests
import sys
import json
import asyncio
import websockets
import threading
import time
from datetime import datetime

class TermDeskAPITester:
    def __init__(self, base_url="https://remote-term-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.ws_url = base_url.replace('https://', 'wss://').replace('http://', 'ws://')
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_create_session(self, username="test_host"):
        """Test session creation"""
        success, response = self.run_test(
            "Create Session",
            "POST",
            "sessions",
            200,
            data={"host_username": username}
        )
        if success and 'session_id' in response:
            self.session_id = response['session_id']
            print(f"Created session: {self.session_id}")
            return True
        return False

    def test_get_session(self):
        """Test getting session details"""
        if not self.session_id:
            print("❌ No session ID available for testing")
            return False
        
        success, response = self.run_test(
            "Get Session",
            "GET",
            f"sessions/{self.session_id}",
            200
        )
        return success

    def test_get_nonexistent_session(self):
        """Test getting non-existent session"""
        success, response = self.run_test(
            "Get Non-existent Session",
            "GET",
            "sessions/nonexistent123",
            404
        )
        return success

    async def test_websocket_connection(self):
        """Test WebSocket connection"""
        if not self.session_id:
            print("❌ No session ID available for WebSocket testing")
            return False

        print(f"\n🔍 Testing WebSocket Connection...")
        self.tests_run += 1
        
        try:
            ws_url = f"{self.ws_url}/api/ws/{self.session_id}?username=test_user&is_host=true"
            print(f"Connecting to: {ws_url}")
            
            async with websockets.connect(ws_url) as websocket:
                print("✅ WebSocket connected successfully")
                
                # Wait for messages (welcome and member_update)
                welcome_received = False
                for _ in range(3):  # Try to receive up to 3 messages
                    try:
                        message = await asyncio.wait_for(websocket.recv(), timeout=5)
                        data = json.loads(message)
                        
                        if data.get('type') == 'welcome':
                            print("✅ Received welcome message")
                            welcome_received = True
                        elif data.get('type') == 'member_update':
                            print("✅ Received member update")
                    except asyncio.TimeoutError:
                        break
                
                if welcome_received:
                    self.tests_passed += 1
                    return True
                else:
                    print("❌ Welcome message not received")
                    return False
                    
        except Exception as e:
            print(f"❌ WebSocket connection failed: {str(e)}")
            return False

    async def test_websocket_command_execution(self):
        """Test command execution through WebSocket"""
        if not self.session_id:
            print("❌ No session ID available for WebSocket testing")
            return False

        print(f"\n🔍 Testing WebSocket Command Execution...")
        self.tests_run += 1
        
        try:
            ws_url = f"{self.ws_url}/api/ws/{self.session_id}?username=test_host&is_host=true"
            
            async with websockets.connect(ws_url) as websocket:
                # Wait for initial messages (welcome and member_update)
                for _ in range(3):
                    try:
                        await asyncio.wait_for(websocket.recv(), timeout=2)
                    except asyncio.TimeoutError:
                        break
                
                # Send command execution request
                command_msg = {
                    "type": "execute_command",
                    "command": "echo 'Hello TermDesk'",
                    "username": "test_host"
                }
                await websocket.send(json.dumps(command_msg))
                
                # Wait for response
                response = await asyncio.wait_for(websocket.recv(), timeout=10)
                data = json.loads(response)
                
                if data.get('type') == 'terminal_output':
                    print("✅ Command executed successfully")
                    print(f"Command: {data.get('command')}")
                    print(f"Output: {data.get('output', '').strip()}")
                    self.tests_passed += 1
                    return True
                else:
                    print(f"❌ Unexpected response type: {data.get('type')}")
                    return False
                    
        except Exception as e:
            print(f"❌ Command execution failed: {str(e)}")
            return False

    async def test_websocket_permission_management(self):
        """Test permission management through WebSocket"""
        if not self.session_id:
            print("❌ No session ID available for WebSocket testing")
            return False

        print(f"\n🔍 Testing WebSocket Permission Management...")
        self.tests_run += 1
        
        try:
            # Create two WebSocket connections - host and member
            host_url = f"{self.ws_url}/api/ws/{self.session_id}?username=test_host&is_host=true"
            member_url = f"{self.ws_url}/api/ws/{self.session_id}?username=test_member&is_host=false"
            
            async with websockets.connect(host_url) as host_ws, \
                       websockets.connect(member_url) as member_ws:
                
                # Wait for welcome messages
                await asyncio.wait_for(host_ws.recv(), timeout=5)
                await asyncio.wait_for(member_ws.recv(), timeout=5)
                
                # Wait for member update messages
                await asyncio.wait_for(host_ws.recv(), timeout=5)
                await asyncio.wait_for(member_ws.recv(), timeout=5)
                
                # Host grants permission to member
                grant_msg = {
                    "type": "grant_permission",
                    "username": "test_member"
                }
                await host_ws.send(json.dumps(grant_msg))
                
                # Wait for member update
                response = await asyncio.wait_for(host_ws.recv(), timeout=5)
                data = json.loads(response)
                
                if data.get('type') == 'member_update':
                    members = data.get('members', [])
                    member_data = next((m for m in members if m['username'] == 'test_member'), None)
                    
                    if member_data and member_data.get('has_permission'):
                        print("✅ Permission granted successfully")
                        
                        # Test revoking permission
                        revoke_msg = {
                            "type": "revoke_permission",
                            "username": "test_member"
                        }
                        await host_ws.send(json.dumps(revoke_msg))
                        
                        # Wait for member update
                        response = await asyncio.wait_for(host_ws.recv(), timeout=5)
                        data = json.loads(response)
                        
                        if data.get('type') == 'member_update':
                            members = data.get('members', [])
                            member_data = next((m for m in members if m['username'] == 'test_member'), None)
                            
                            if member_data and not member_data.get('has_permission'):
                                print("✅ Permission revoked successfully")
                                self.tests_passed += 1
                                return True
                            else:
                                print("❌ Permission not revoked properly")
                                return False
                        else:
                            print(f"❌ Unexpected response type: {data.get('type')}")
                            return False
                    else:
                        print("❌ Permission not granted properly")
                        return False
                else:
                    print(f"❌ Unexpected response type: {data.get('type')}")
                    return False
                    
        except Exception as e:
            print(f"❌ Permission management failed: {str(e)}")
            return False

def main():
    print("🚀 Starting TermDesk Backend API Tests")
    print("=" * 50)
    
    tester = TermDeskAPITester()
    
    # Test REST API endpoints
    print("\n📡 Testing REST API Endpoints")
    print("-" * 30)
    
    if not tester.test_root_endpoint():
        print("❌ Root endpoint failed, stopping tests")
        return 1
    
    if not tester.test_create_session():
        print("❌ Session creation failed, stopping tests")
        return 1
    
    if not tester.test_get_session():
        print("❌ Get session failed")
    
    if not tester.test_get_nonexistent_session():
        print("❌ Non-existent session test failed")
    
    # Test WebSocket functionality
    print("\n🔌 Testing WebSocket Functionality")
    print("-" * 30)
    
    async def run_websocket_tests():
        await tester.test_websocket_connection()
        await tester.test_websocket_command_execution()
        await tester.test_websocket_permission_management()
    
    try:
        asyncio.run(run_websocket_tests())
    except Exception as e:
        print(f"❌ WebSocket tests failed: {str(e)}")
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())