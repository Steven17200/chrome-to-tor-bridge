@echo off
:: 1. Récupère l'adresse envoyée par Chrome
set "URL=%~1"

:: 2. Supprime le préfixe tor-open://
set "URL=%URL:tor-open://=%"

:: 3. Lance Tor Browser en ajoutant proprement UN SEUL https:// au début
start "" "C:\Users\BE QUIET\Desktop\Tor Browser\Browser\firefox.exe" "https://%URL%"