@echo off
setlocal
cd /d "%~dp0"
set "PORT=4173"

if /i "%~1"=="tests" goto run_tests

rem ---- Preview the site locally (needed because the pages load JSON) ----
where npx >nul 2>nul
if not errorlevel 1 goto use_node
where python >nul 2>nul
if not errorlevel 1 goto use_python
where py >nul 2>nul
if not errorlevel 1 goto use_py

echo Need Node.js (https://nodejs.org) or Python (https://python.org) to run a local server.
pause
exit /b 1

:use_node
start "Site test server (close this window to stop)" cmd /k npx --yes http-server -p %PORT% -c-1
goto open_browser

:use_python
start "Site test server (close this window to stop)" cmd /k python -m http.server %PORT%
goto open_browser

:use_py
start "Site test server (close this window to stop)" cmd /k py -m http.server %PORT%

:open_browser
ping -n 4 127.0.0.1 >nul
start "" "http://localhost:%PORT%/"
echo.
echo Test server running at http://localhost:%PORT%/
echo Close the server window when you are done.
exit /b 0

:run_tests
rem ---- Run the Playwright checks: test.bat tests ----
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is required for the tests. Get it from https://nodejs.org
  pause
  exit /b 1
)
if not exist node_modules call npm install
call npx playwright install chromium
call npx playwright test
echo.
echo Screenshots are in the test-results folder.
pause
