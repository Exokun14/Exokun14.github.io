@echo off
setlocal
pushd "%~dp0"

echo ============================================
echo  Visitor counter setup (GoatCounter)
echo  Free, no cookies, no consent banner.
echo ============================================
echo.
echo Step 1: Create a free account and pick a site code.
echo         (If you already have one, skip this step.)
echo.
choice /c YN /m "Open the sign-up page now"
if errorlevel 2 goto ask
if errorlevel 1 start "" "https://www.goatcounter.com/signup"
echo.
echo Finish signing up in your browser, then come back here.
echo.

:ask
echo Step 2: Enter the site code you chose.
echo         It is the part before .goatcounter.com
echo         Example: if your address is clarence.goatcounter.com, type clarence
echo.
set "CODE="
set /p "CODE=Your code: "
if "%CODE%"=="" (
    echo.
    echo No code entered. Nothing was changed.
    goto done
)

if not exist "assets\js\stats.js" (
    echo.
    echo ERROR: assets\js\stats.js was not found. Run this file from your site folder.
    goto done
)

powershell -NoProfile -Command "$c=$env:CODE.Trim().ToLower(); if($c -notmatch '^[a-z0-9][a-z0-9-]{1,30}$'){exit 2}; $f='assets\js\stats.js'; $t=[IO.File]::ReadAllText($f); $n=[regex]::Replace($t,'const CODE = ''[^'']*'';',('const CODE = ''' + $c + ''';')); [IO.File]::WriteAllText($f,$n)"
if errorlevel 2 (
    echo.
    echo That code does not look right. Use only letters, numbers and dashes.
    goto done
)
if errorlevel 1 (
    echo.
    echo ERROR: Could not update assets\js\stats.js
    goto done
)

echo.
echo Saved. The counter is now switched on in assets\js\stats.js
echo Your visits will appear at: https://%CODE%.goatcounter.com
echo.
if exist publish.bat (
    choice /c YN /m "Publish the site now"
    if errorlevel 2 goto done
    call publish.bat
) else (
    echo Next: push the site to GitHub so the counter goes live.
)

:done
echo.
popd
pause
