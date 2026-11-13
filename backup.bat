@echo off
setlocal
pushd "%~dp0"

REM ============================================
REM  Portfolio Site - Source Backup
REM  Zips the whole site into .\backups\
REM  (no node_modules, .git, test reports, zips or logs)
REM ============================================

REM ---- Settings ----
set "PROJECT=portfolio-site"
set "BACKUP_DIR=%CD%\backups"
REM Set to 1 to include .env files (they may hold secrets)
set "INCLUDE_ENV=0"

echo ============================================
echo  %PROJECT% - Source Backup
echo ============================================
echo.

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM ---- Make sure backups/ is git-ignored ----
if not exist .gitignore type nul > .gitignore
powershell -NoProfile -Command "$t=[IO.File]::ReadAllText('.gitignore'); $nl=[Environment]::NewLine; if($t -notmatch '(?m)^/?backups/?\s*$'){ if($t.Length -gt 0 -and -not $t.EndsWith($nl)){$t+=$nl}; $t+='backups/'+$nl; [IO.File]::WriteAllText('.gitignore',$t); Write-Host 'Added backups/ to .gitignore' }"

REM ---- Current version (package.json if present) ----
set "VERSION="
if exist package.json for /f "delims=" %%V in ('powershell -NoProfile -Command "try{(Get-Content package.json -Raw | ConvertFrom-Json).version}catch{}"') do set "VERSION=_v%%V"

REM ---- Timestamp (locale-independent) ----
for /f "delims=" %%T in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HHmm"') do set "STAMP=%%T"

set "ZIP_PATH=%BACKUP_DIR%\%PROJECT%%VERSION%_%STAMP%.zip"
set "STAGE_ROOT=%TEMP%\%PROJECT%_stage_%RANDOM%"
set "STAGE=%STAGE_ROOT%\%PROJECT%"

REM ---- Copy source to a staging folder, minus junk ----
set "XF=*.zip *.log .DS_Store Thumbs.db"
if "%INCLUDE_ENV%"=="0" set "XF=%XF% .env"

echo Output  : %ZIP_PATH%
echo.
echo Collecting site files...
robocopy "%CD%" "%STAGE%" /E /XD node_modules backups .git test-results playwright-report /XF %XF% /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 (
    echo.
    echo ERROR: Failed to collect files.
    if exist "%STAGE_ROOT%" rmdir /s /q "%STAGE_ROOT%"
    pause
    exit /b 1
)

REM ---- Zip it ----
echo Zipping...
powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; if(Test-Path $env:ZIP_PATH){Remove-Item $env:ZIP_PATH -Force}; [IO.Compression.ZipFile]::CreateFromDirectory($env:STAGE, $env:ZIP_PATH, [IO.Compression.CompressionLevel]::Optimal, $true)"

if exist "%STAGE_ROOT%" rmdir /s /q "%STAGE_ROOT%"

if not exist "%ZIP_PATH%" (
    echo.
    echo ERROR: Zip was not created.
    pause
    exit /b 1
)

for %%F in ("%ZIP_PATH%") do set "ZIP_SIZE=%%~zF"

echo.
echo ============================================
echo  Backup complete.
echo  %ZIP_PATH%
echo  Size: %ZIP_SIZE% bytes
echo ============================================
popd
pause
