@echo off
echo ==================================================
echo   SWADESHI YATRA - GITHUB UPLOAD
echo ==================================================
echo.
echo Adding all new files and changes...
git add .
echo.
echo Committing changes with message: "Added drag and drop image upload, fixed mobile API connectivity, and improved backend setup scripts"
git commit -m "Added drag and drop image upload, fixed mobile API connectivity, and improved backend setup scripts"
echo.
echo Pushing code to GitHub repository...
git push origin main
echo.
echo ==================================================
echo UPLOAD COMPLETE!
echo ==================================================
pause
