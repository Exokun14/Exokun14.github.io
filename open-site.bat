@echo off
setlocal
cd /d "%~dp0"

set "REMOTE="
for /f "delims=" %%U in ('git remote get-url origin 2^>nul') do set "REMOTE=%%U"
if not defined REMOTE (
  echo No GitHub remote found. Run publish.bat first.
  pause
  exit /b 1
)

set "SITE="
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "$u='%REMOTE%' -replace '\.git$',''; if ($u -match '[:/]([^/:]+)/([^/]+)$') { $o=$matches[1].ToLower(); $r=$matches[2]; if ($r -ieq ($o + '.github.io')) { 'https://' + $o + '.github.io/' } else { 'https://' + $o + '.github.io/' + $r + '/' } }"`) do set "SITE=%%P"

if not defined SITE (
  echo Could not work out the site URL from: %REMOTE%
  pause
  exit /b 1
)

echo Opening %SITE%
start "" "%SITE%"
