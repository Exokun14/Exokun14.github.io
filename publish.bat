@echo off
setlocal
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo Git is not installed or not on PATH. Get it from https://git-scm.com
  pause
  exit /b 1
)

git remote get-url origin >nul 2>nul
if not errorlevel 1 goto have_remote

echo No GitHub remote set yet.
echo Create an EMPTY repo on GitHub first, then paste its URL below.
set /p REMOTE=Repo URL: 
if "%REMOTE%"=="" (
  echo No URL entered.
  pause
  exit /b 1
)
git remote add origin "%REMOTE%"

:have_remote
set "MSG=%~1"
if "%MSG%"=="" set "MSG=Update site"

git add -A
git diff --cached --quiet
if errorlevel 1 git commit -m "%MSG%"

git branch -M main
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. Check the error above, your GitHub login, and the repo URL.
  pause
  exit /b 1
)

echo.
echo Pushed to GitHub. If Pages is enabled, the site updates in a minute or two.
pause
