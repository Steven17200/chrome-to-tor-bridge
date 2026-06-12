// ==UserScript==
// @name         Auto-Ouvrir dans Tor Browser (Chrome) - Dynamique
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Bascule vers Tor automatiquement ou propose l'ajout via un bouton flottant. Verifie les mises a jour automatiquement.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torproject.org
// @author       Stephane
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/Steven17200/chrome-to-tor-bridge/main/auto-open-tor.user.js
// @downloadURL  https://raw.githubusercontent.com/Steven17200/chrome-to-tor-bridge/main/auto-open-tor.user.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = "2.4";
    const VERSION_CHECK_URL = "https://raw.githubusercontent.com/Steven17200/chrome-to-tor-bridge/main/version.txt";
    const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

    function checkForUpdates() {
        const lastCheck = GM_getValue("last_update_check", 0);
        const now = Date.now();
        if (now - lastCheck < UPDATE_INTERVAL) return;
        GM_setValue("last_update_check", now);

        GM_xmlhttpRequest({
            method: "GET",
            url: VERSION_CHECK_URL,
            onload: function(response) {
                const latestVersion = response.responseText.trim();
                const currentVersion = GM_getValue("script_version", SCRIPT_VERSION);
                if (latestVersion && latestVersion !== currentVersion) {
                    showUpdateNotification(latestVersion);
                }
            },
            onerror: function() {
                console.log("Impossible de verifier les mises a jour");
            }
        });
    }

    function showUpdateNotification(newVersion) {
        const updateDiv = document.createElement('div');
        updateDiv.innerHTML = '<div style="position: fixed; top: 20px; right: 20px; z-index: 2147483647; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); font-family: Arial, sans-serif; max-width: 300px; animation: slideIn 0.3s ease-out;"><div style="font-weight: bold; margin-bottom: 8px;">Mise a jour disponible !</div><div style="font-size: 14px; margin-bottom: 12px;">Version ' + newVersion + ' est disponible<br><span style="font-size: 12px; opacity: 0.8;">(Vous avez la ' + (GM_getValue("script_version", SCRIPT_VERSION)) + ')</span></div><button id="updateNowBtn" style="background: white; color: #667eea; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; margin-right: 8px;">Mettre a jour</button><button id="remindLaterBtn" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 13px;">Plus tard</button></div><style>@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }</style>';

        document.body.appendChild(updateDiv);

        document.getElementById('updateNowBtn').addEventListener('click', () => {
            GM_setValue("script_version", newVersion);
            updateDiv.remove();
            GM_notification({
                title: "Mise a jour en cours...",
                text: "Le script va se mettre a jour automatiquement.",
                timeout: 3000
            });
        });

        document.getElementById('remindLaterBtn').addEventListener('click', () => {
            updateDiv.remove();
        });

        setTimeout(() => {
            if (updateDiv.parentNode) updateDiv.remove();
        }, 15000);
    }

    const DEFAULT_SITES = ["onion.to", "ahmia.fi", "duckduckgo.com"];
    GM_setValue("script_version", SCRIPT_VERSION);
    let torSites = GM_getValue("mes_sites_tor", DEFAULT_SITES);
    const currentHostname = window.location.hostname;

    function shouldRedirect(hostname) {
        return torSites.some(site => hostname === site || hostname.endsWith('.' + site));
    }

    checkForUpdates();

    if (shouldRedirect(currentHostname)) {
        window.stop();
        const cleanUrl = window.location.href.replace(/^https?:///, '');
        window.location.href = 'tor-open://' + cleanUrl;

        document.documentElement.innerHTML = '<div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; color: #2d3748;"><h1 style="color: #4a285a;">Redirection vers Tor Browser...</h1><p style="font-size: 18px;">Veuillez cliquer sur <b>"Ouvrir Tor Open Protocol"</b> dans la fenetre Chrome.</p><p style="color: #718096;"><i>Cet onglet se fermera automatiquement dans 10 secondes.</i></p></div>';

        setTimeout(() => { window.close(); }, 10000);
    }
    else {
        window.addEventListener('DOMContentLoaded', () => {
            const torBtn = document.createElement('button');
            torBtn.innerHTML = ' Envoyer vers Tor';
            Object.assign(torBtn.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '2147483647',
                padding: '8px 14px',
                backgroundColor: '#59316B',
                color: '#FFFFFF',
                border: '1px solid #4a285a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                opacity: '0.4',
                transition: 'opacity 0.2s, transform 0.1s'
            });

            torBtn.onmouseover = () => torBtn.style.opacity = '1';
            torBtn.onmouseout = () => torBtn.style.opacity = '0.4';
            torBtn.onmousedown = () => torBtn.style.transform = 'scale(0.95)';
            torBtn.onmouseup = () => torBtn.style.transform = 'scale(1)';

            torBtn.onclick = () => {
                if (!torSites.includes(currentHostname)) {
                    torSites.push(currentHostname);
                    GM_setValue("mes_sites_tor", torSites);
                    torBtn.innerHTML = ' Ajoute ! Transfert...';
                    torBtn.style.backgroundColor = '#28a745';
                    setTimeout(() => { window.location.reload(); }, 600);
                }
            };

            document.body.appendChild(torBtn);
        });
    }
})();