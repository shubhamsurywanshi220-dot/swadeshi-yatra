@echo off
echo Starting Swadeshi Yatra Mobile App...
cd mobile
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting Expo...
echo.
echo ===================================================
echo  PHYSICAL DEVICE TESTING (RECOMMENDED)
echo  1. Scanning: Open 'Expo Go' app on your phone and scan QR.
echo  2. WiFi: Device and Laptop MUST be on the same WiFi.
echo  3. Tunnel: If QR doesn't work, press 't' for tunnel mode.
echo  4. Reload: Press 'r' inside the Expo terminal to reload.
echo ===================================================
echo.
echo Running IP Fix Script...
node ..\auto_fix_ip.js
echo.
set /p CHOICE="Run with Tunnel mode (Only if LAN fails)? [y/n]: "
if /I "%CHOICE%"=="y" (
    call npx.cmd expo start --tunnel
) else (
    call npx.cmd expo start
)
pause
