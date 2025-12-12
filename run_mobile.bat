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
echo  INSTRUCTIONS:
echo  1. Scan the QR code with the 'Expo Go' app on your phone.
echo  2. OR press 'a' to run on Android Emulator.
echo  3. To RELOAD changes, click in this window and press 'r'.
echo ===================================================
echo.
call npx.cmd expo start
pause
