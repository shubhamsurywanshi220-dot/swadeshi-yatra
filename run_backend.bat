@echo off
echo Starting Swadeshi Yatra Backend...
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting Node.js Server...
echo Mobile App API URL: http://192.168.137.116:5000/api (Use this for physical devices)
call npx nodemon index.js
pause
