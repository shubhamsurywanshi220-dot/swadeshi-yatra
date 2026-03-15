@echo off
echo Starting Swadeshi Yatra Admin Panel...
cd admin-panel
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting Vite Dev Server...
call npm run dev
pause
