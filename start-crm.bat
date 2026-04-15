@echo off
title CRM PFE - Startup
color 0A

echo.
echo  ============================================
echo   CRM - PFE Project Startup
echo  ============================================
echo.

:: =============================================
:: CONFIGURATION - EDIT THESE VALUES
:: =============================================

set FB_TOKEN=use your facebook token
set IG_TOKEN=use your instagram token
set NG_TOKEN=use your ngrok token
set JWT_TOKEN=your 32 at least character JWT token

:: PATHS - EDIT THESE TO MATCH YOUR MACHINE
set BACKEND_PATH=C:\Users\user\Desktop\pfe\crm-backend
set FRONTEND_PATH=C:\Users\user\Desktop\pfe\crm-frontend
set PYTHON_PATH=C:\Users\user\Desktop\pfe\crmAIservice
set PYTHON_FILE=app.py
set NGROK_PATH=C:\ngrok\ngrok.exe

:: =============================================
:: SET ENVIRONMENT TOKENS
:: =============================================

echo [1/5] Setting environment tokens...
set FB_TOKEN=%FB_TOKEN%
set IG_TOKEN=%IG_TOKEN%
set NG_TOKEN=%NG_TOKEN%
echo  Tokens set OK
echo.

:: =============================================
:: START PYTHON ML SERVICE
:: =============================================

echo [2/5] Starting Python ML service on port 8000...

cd /d "%PYTHON_PATH%"
set TFHUB_CACHE_DIR=%PYTHON_PATH%\tfhub_cache

start /B py -3.11 -m uvicorn app:app --reload --port 8000

timeout /t 4 /nobreak >nul
echo.

:: =============================================
:: START SPRING BOOT BACKEND
:: =============================================

echo [3/5] Starting Spring Boot backend on port 8080...
start "Spring Boot Backend" cmd /k "cd /d %BACKEND_PATH% && mvnw.cmd spring-boot:run"
echo  Spring Boot starting (may take 10-15 seconds)...
timeout /t 15 /nobreak >nul
echo.

:: =============================================
:: START NGROK
:: =============================================

echo [4/5] Starting ngrok tunnel on port 8080...
start "Ngrok Tunnel" cmd /k "%NGROK_PATH% http 8080"
echo  Ngrok starting...
timeout /t 4 /nobreak >nul
echo.

:: =============================================
:: START ANGULAR FRONTEND
:: =============================================

echo [5/5] Starting Angular frontend on port 4200...
start "Angular Frontend" cmd /k "cd /d %FRONTEND_PATH% && ng serve --open"
echo  Angular starting (may take 15-20 seconds)...
echo.

:: =============================================
:: DONE
:: =============================================

echo  ============================================
echo   All services started!
echo  ============================================
echo.
echo   Python ML  ^> http://localhost:8000
echo   Backend    ^> http://localhost:8080
echo   Frontend   ^> http://localhost:4200
echo   Ngrok      ^> check ngrok window for URL
echo.
echo  ============================================
pause
