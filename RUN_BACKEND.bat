@echo off
TITLE AgroLens Backend Server
ECHO ========================================================
ECHO    Starting AgroLens Backend Server
ECHO ========================================================
ECHO.
ECHO Installing dependencies (if missing)...
pip install fastapi uvicorn pydantic numpy > nul 2>&1
ECHO.
ECHO Starting Server at http://localhost:8000...
ECHO (Please keep this window OPEN while using the app)
ECHO.
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
PAUSE
