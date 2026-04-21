echo ==================================================
echo   SWADESHI YATRA - START ALL SERVICES
echo ==================================================
echo.
echo Automatically configuring latest IP address...
node auto_fix_ip.js
echo.
echo.
echo Starting Backend (Port 5005)...
start "Swadeshi Backend" cmd /k "cd backend && npm install && node index.js"
timeout /t 5 /nobreak >nul

echo Starting Admin Panel (Vite)...
start "Swadeshi Admin" cmd /k "cd admin-panel && npm run dev"
timeout /t 2 /nobreak >nul

echo Starting Mobile App (Expo)...
start "Swadeshi Mobile" cmd /k "cd mobile && npx expo start -c"

echo.
echo All services have been launched in separate windows!
echo You can close this window.
pause
