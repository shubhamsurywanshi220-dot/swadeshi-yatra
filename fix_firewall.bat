@echo off
echo ==========================================
echo   Swadeshi Yatra - Connection Fixer
echo ==========================================
echo.
echo This script will open the necessary ports in your Windows Firewall
echo so your phone can connect to the app and backend.
echo.
echo Requesting Admin Privileges...
echo.

:: Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

:: If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

echo.
echo Opening Port 5000 (Backend)...
netsh advfirewall firewall delete rule name="Swadeshi Backend" >nul
netsh advfirewall firewall add rule name="Swadeshi Backend" dir=in action=allow protocol=TCP localport=5000
echo.

echo Opening Port 8081 (Expo Metro Bundler)...
netsh advfirewall firewall delete rule name="Swadeshi Expo Metro" >nul
netsh advfirewall firewall add rule name="Swadeshi Expo Metro" dir=in action=allow protocol=TCP localport=8081
echo.

echo Opening Port 19000 (Expo Default)...
netsh advfirewall firewall delete rule name="Swadeshi Expo Main" >nul
netsh advfirewall firewall add rule name="Swadeshi Expo Main" dir=in action=allow protocol=TCP localport=19000
echo.

echo ==========================================
echo   SUCCESS! Firewall Rules Added.
echo ==========================================
echo.
echo Please try opening the app on your phone now.
echo.
pause
