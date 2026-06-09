@echo off
cd /d "%~dp0"
title EVA Agency local server
echo EVA Agency local preview
echo.
echo Open this URL in your browser:
echo http://127.0.0.1:4173/
echo.
echo Keep this window open while testing the site.
echo Press Ctrl+C to stop the server.
echo.
start "" cmd /c "timeout /t 2 /nobreak >nul & start "" "http://127.0.0.1:4173/""
"C:\Program Files\nodejs\node.exe" server.mjs
echo.
echo Server stopped.
pause
