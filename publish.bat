@echo off
setlocal
cd /d "%~dp0"

rem ---- Git ----
where git >nul 2>nul
if errorlevel 1 goto no_git

rem ---- GitHub CLI (installs itself if missing) ----
if exist "%ProgramFiles%\GitHub CLI\gh.exe" set "PATH=%PATH%;%ProgramFiles%\GitHub CLI"
where gh >nul 2>nul
if not errorlevel 1 goto have_gh
echo Installing GitHub CLI...
winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
if exist "%ProgramFiles%\GitHub CLI\gh.exe" set "PATH=%PATH%;%ProgramFiles%\GitHub CLI"
where gh >nul 2>nul
if errorlevel 1 goto no_gh

:have_gh
rem ---- Log in to GitHub (opens browser the first time only) ----
gh auth status >nul 2>&1
if errorlevel 1 gh auth login -w -p https
gh auth status >nul 2>&1
if errorlevel 1 goto login_failed
gh auth setup-git >nul 2>&1

for /f "delims=" %%L in ('gh api user --jq .login') do set "GHUSER=%%L"
for /f "delims=" %%I in ('gh api user --jq .id') do set "GHID=%%I"

rem ---- Git identity (only if you haven't set one) ----
git config user.name >nul 2>&1
if errorlevel 1 git config user.name "%GHUSER%"
git config user.email >nul 2>&1
if errorlevel 1 git config user.email "%GHID%+%GHUSER%@users.noreply.github.com"

rem ---- Repo (creates <username>.github.io the first time) ----
if not exist ".git" git init -b main
git remote get-url origin >nul 2>&1
if not errorlevel 1 goto have_remote
set "REPO=%GHUSER%.github.io"
echo Creating GitHub repo %REPO% ...
gh repo create %REPO% --public --description "My personal website"
git remote add origin "https://github.com/%GHUSER%/%REPO%.git"

:have_remote
rem ---- Commit and push ----
set "MSG=%~1"
if "%MSG%"=="" set "MSG=Update site"
git add -A
git diff --cached --quiet
if errorlevel 1 git commit -m "%MSG%"
git branch -M main
git pull --rebase origin main >nul 2>&1
git push -u origin main
if errorlevel 1 goto push_failed

rem ---- Turn on GitHub Pages (harmless if already on) ----
for /f "delims=" %%R in ('gh repo view --json nameWithOwner --jq .nameWithOwner') do set "SLUG=%%R"
gh api -X POST "repos/%SLUG%/pages" -f "source[branch]=main" -f "source[path]=/" >nul 2>&1

echo.
echo Done. Your site is live in a minute or two (the first deploy can take a bit longer).
call open-site.bat
exit /b 0

:no_git
echo Git is not installed. Get it from https://git-scm.com then run this again.
pause
exit /b 1

:no_gh
echo Could not install GitHub CLI automatically.
echo Install it from https://cli.github.com then run this again.
pause
exit /b 1

:login_failed
echo GitHub login did not complete. Run publish.bat again to retry.
pause
exit /b 1

:push_failed
echo.
echo Push failed. Check the error above.
pause
exit /b 1
