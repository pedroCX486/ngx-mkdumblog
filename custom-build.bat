set BLOGNAME=Custom Title
echo off
cls
echo Compiling ngx-mkdumblog...
call ng build --prod
echo.
echo Updating blog information...
call powershell -Command "(gc dist/ngx-mkdumblog/index.html) -replace '<title>...</title>', '<title>%BLOGNAME%</title>' | Out-File -encoding utf8 dist/ngx-mkdumblog/index.html"
echo.
echo Complete.
cd dist/ngx-mkdumblog
explorer .
echo.
pause
exit