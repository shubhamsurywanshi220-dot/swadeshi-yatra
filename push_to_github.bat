@echo off
echo ==================================================
echo   SWADESHI YATRA - GITHUB UPLOAD
echo ==================================================
echo.
echo Adding all new files and changes...
git add .
echo.
echo Committing changes with message: "Feature: Travel Vlog System with Cloudinary upload, Media Moderation, and Mobile Network Fixes"
git commit -m "Feature: Travel Vlog System with Cloudinary upload, Media Moderation, and Mobile Network Fixes"
echo.
echo Pushing code to GitHub repository...
git push origin main
echo.
echo ==================================================
echo UPLOAD COMPLETE!
echo ==================================================
pause
