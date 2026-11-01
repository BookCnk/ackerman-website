@echo off
title Ackerman Website - Dev Server
cd /d "%~dp0"

echo Stopping any existing process on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

if exist ".next\dev\lock" del /f /q ".next\dev\lock" >nul 2>&1

echo Starting Ackerman Website on http://localhost:3000 ...
start "" http://localhost:3000

call npm run dev
pause
