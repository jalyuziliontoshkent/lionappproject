@echo off
title LION JALYUZI - PROFESSIONAL WEB PORTAL
echo ==============================================
echo  LION JALYUZI TIZIMI ISHGA TUSHIRILMOQDA...
echo ==============================================

echo.
echo [1/2] Backend server (FastAPI) ishga tushirilmoqda...
start "Backend Server" cmd /k "cd backend && python -m uvicorn server:app --reload --port 8000"

echo.
echo [2/2] Professional Website (Vite + React) ishga tushirilmoqda...
start "Professional Web" cmd /k "cd website && npm run dev"

echo.
echo ==============================================
echo  TIZIMLAR ALOHIDA OYNALARDA OCHILDI!
echo  
echo  Backend: http://localhost:8000
echo  Website: http://localhost:5173
echo ==============================================
echo.
echo Kirish uchun:
echo Admin: admin@curtain.uz / admin123
echo Diler: dealer@test.uz / dealer123
echo.
pause
