# TermDesk - Docker Setup for Windows

## Prerequisites

1. **Install Docker Desktop for Windows**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer
   - Make sure Docker Desktop is running (check system tray)

2. **Verify Installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Navigate to the project directory**
   ```powershell
   cd path\to\app
   ```

2. **Start all services**
   ```powershell
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001/api/
   - MongoDB: localhost:27017

4. **Stop services** (Ctrl+C in terminal, then):
   ```powershell
   docker-compose down
   ```

### Option 2: Run in Background

```powershell
# Start services in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

## Common Commands

```powershell
# Rebuild and restart specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Restart a service
docker-compose restart backend
docker-compose restart frontend

# View running containers
docker-compose ps

# Stop all services and remove volumes
docker-compose down -v

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Environment Variables

### Backend (.env.docker)
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `CORS_ORIGINS`: Allowed CORS origins

### Frontend (.env.docker)
- `REACT_APP_BACKEND_URL`: Backend API URL

## Troubleshooting

### Port Already in Use
If ports 3000, 8001, or 27017 are already in use:

1. **Find and stop the process** (PowerShell as Admin):
   ```powershell
   # Check what's using port 3000
   netstat -ano | findstr :3000
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Or change ports in docker-compose.yml**:
   ```yaml
   ports:
     - "3001:3000"  # Use 3001 instead of 3000
   ```

### Docker Not Starting
- Ensure Docker Desktop is running
- Check if WSL 2 is enabled (Windows 10/11)
- Restart Docker Desktop

### Build Errors
```powershell
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Connection Issues
- Make sure all containers are running: `docker-compose ps`
- Check logs: `docker-compose logs`
- Verify network: `docker network ls`

## Development Mode

The setup includes hot-reload for both frontend and backend:
- **Frontend**: Changes in `/frontend/src` will auto-reload
- **Backend**: Changes in `/backend` will auto-reload

## Production Build

For production, modify docker-compose.yml:

```yaml
frontend:
  # ... other config
  command: |
    sh -c "
    yarn build &&
    npx serve -s build -l 3000
    "
```

## Tips for Windows Users

1. **Use PowerShell or Command Prompt** (not Git Bash for Docker commands)
2. **File Watching**: The setup uses polling for file changes (CHOKIDAR_USEPOLLING)
3. **Line Endings**: Git might convert line endings. Set:
   ```powershell
   git config --global core.autocrlf input
   ```
4. **Performance**: Use WSL 2 backend in Docker Desktop for better performance

## Clean Up

To completely remove all Docker resources:

```powershell
# Stop and remove containers, networks
docker-compose down

# Remove volumes (deletes database data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Support

If you encounter issues:
1. Check Docker Desktop is running
2. View logs: `docker-compose logs`
3. Verify all containers are healthy: `docker-compose ps`
4. Try a clean rebuild: `docker-compose down -v && docker-compose up --build`