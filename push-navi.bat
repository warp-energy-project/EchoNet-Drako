@echo off
cd /d C:\navi
echo 🔁 Synchronizuję Navi z GitHub...

:: Dodaj wszystkie zmienione pliki
git add .

:: Automatyczny opis commita z timestampem
set hour=%time:~0,2%
if "%hour:~0,1%"==" " set hour=0%hour:~1,1%
git commit -m "Auto-sync %date% %hour%:%time:~3,2%"

:: Wyślij na GitHub
git push origin main

echo ✅ Gotowe. Navi został zsynchronizowany z EchoNet.
pause
