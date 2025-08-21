@echo off
echo Checking for administrator privileges...

:: Check if already running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/k cd /d %CD% && wifi-scanner-env\Scripts\activate && python scan.py' -Verb RunAs"
    exit /b
)

echo Running with administrator privileges!
echo.

:: Activate virtual environment
if exist "wifi-scanner-env\Scripts\activate" (
    call wifi-scanner-env\Scripts\activate
    echo Virtual environment activated
) else (
    echo Creating virtual environment...
    python -m venv wifi-scanner-env
    call wifi-scanner-env\Scripts\activate
    pip install flask flask-cors requests
    echo Dependencies installed
)

:: Run the scanner
echo Starting WiFi Scanner...
python scan.py

pause