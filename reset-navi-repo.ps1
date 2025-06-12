# Ścieżki
$oldPath = "C:\navi"
$backupPath = "C:\navi-old"
$newPath = "C:\navi"

# 1. Zmień nazwę starego folderu
Rename-Item -Path $oldPath -NewName $backupPath -Force

# 2. Sklonuj repozytorium na czysto
git clone https://github.com/warp-energy-project/EchoNet-Drako.git $newPath

# 3. Skopiuj czyste pliki z backupu (BEZ tokenów)
Copy-Item "$backupPath\language" -Destination "$newPath" -Recurse -Force
Copy-Item "$backupPath\languageTrainer.PL" -Destination "$newPath" -Recurse -Force
Copy-Item "$backupPath\gui" -Destination "$newPath" -Recurse -Force
Copy-Item "$backupPath\WarpChat.html" -Destination "$newPath" -Force
Copy-Item "$backupPath\main.js" -Destination "$newPath" -Force
Copy-Item "$backupPath\style.css" -Destination "$newPath" -Force
Copy-Item "$backupPath\engine.js" -Destination "$newPath" -Force
Copy-Item "$backupPath\Navi.Self.js" -Destination "$newPath" -Force

# 4. Dodaj .gitignore z ukryciem tokena (jeśli nie ma)
Add-Content "$newPath\.gitignore" "`n.github_token.txt"

# 5. Commituj i wypchnij nową czystą wersję
cd $newPath
git add .
git commit -m "Reset repo: czysta historia bez tokenów"
git push --force origin main
