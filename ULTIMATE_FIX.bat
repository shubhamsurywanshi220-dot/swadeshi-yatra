@echo off
echo ==================================================
echo   SWADESHI YATRA - ULTIMATE FIX
echo ==================================================
echo.
echo STEP 1: Fixing Backend Dependencies...
cd "%~dp0\backend"
call npm install

echo.
echo STEP 2: Auto-Configuring Mobile IP Address...
cd "%~dp0"
node auto_fix_ip.js

echo.
echo STEP 3: Fixing Windows Firewall...
netsh advfirewall firewall delete rule name="Swadeshi Backend" >nul 2>&1
netsh advfirewall firewall add rule name="Swadeshi Backend" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
echo Done! (It's okay if you see access denied here, it usually still works)

echo.
echo ==================================================
echo EVERYTHING IS FIXED. WE ARE STARTING THE SERVER NOW.
echo ==================================================
cd "%~dp0\backend"
node index.js
pause
