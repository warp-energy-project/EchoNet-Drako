@echo off
echo --- [NAVI SYNC START] ---
cd /d C:\navi

echo [1/3] Pobieranie zmian z GitHub...
git pull origin main

echo [2/3] Odswieżanie plików pamięci...
type echo-language.json > nul 2> nul
if errorlevel 1 echo Brak pliku echo-language.json!
type prompt.txt > nul 2> nul
if errorlevel 1 echo Brak pliku prompt.txt!

echo [3/3] Rejestrowanie logu synchronizacji...
echo %date% %time% >> sync.log
echo Synchronizacja zakończona pomyślnie >> sync.log
echo --- [NAVI SYNC DONE] ---

pause

:: Sprawdzenie i dodanie .gitignore, jeśli nie istnieje
IF NOT EXIST ".gitignore" (
    echo Tworzenie pliku .gitignore...
    echo *.log> .gitignore
    echo *.tmp>> .gitignore
    echo *.bak>> .gitignore
    echo __pycache__/>> .gitignore
    echo EchoNet-Drako/>> .gitignore
    echo sync.log>> .gitignore
    echo .DS_Store>> .gitignore
    echo memory/>> .gitignore
)
