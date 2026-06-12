// ==UserScript==
// @name         Auto-Ouvrir dans Tor Browser (Chrome) - Dynamique
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bascule vers Tor automatiquement ou propose l'ajout via un bouton flottant en bas à droite avec reset
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @author       Stéphane
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Tes sites de base
    const DEFAULT_SITES = [
        "onion.to",
        "ahmia.fi",
        "duckduckgo.com"
    ];

    // 2. Chargement de la liste dynamique
    let torSites = GM_getValue("mes_sites_tor", DEFAULT_SITES);
    const currentHostname = window.location.hostname;

    // Fonction de vérification
    function shouldRedirect(hostname) {
        return torSites.some(site => hostname === site || hostname.endsWith('.' + site));
    }

    // NOUVEAU : Fonction pour réinitialiser
    function resetSites() {
        GM_setValue("mes_sites_tor", DEFAULT_SITES);
        window.location.reload();
    }

    // =========================================================================
    // CAS 1 : LE SITE EST DANS LA LISTE -> REDIRECTION IMMÉDIATE
    // =========================================================================
    if (shouldRedirect(currentHostname)) {
        window.stop();

        const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = `tor-open://${cleanUrl}`;

        document.documentElement.innerHTML = `
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; color: #2d3748;">
                <h1 style="color: #4a285a;">🚀 Redirection vers Tor Browser...</h1>
                <p style="font-size: 18px;">Veuillez cliquer sur <b>"Ouvrir Tor Open Protocol"</b> dans la fenêtre Chrome.</p>
                <p style="color: #718096;"><i>Cet onglet se fermera automatiquement dans 10 secondes.</i></p>
            </div>
        `;

        setTimeout(() => { window.close(); }, 10000);
    }

    // =========================================================================
    // CAS 2 : LE SITE N'EST PAS DANS LA LISTE -> AFFICHAGE DES BOUTONS
    // =========================================================================
    else {
        window.addEventListener('DOMContentLoaded', () => {

            // Conteneur pour les boutons
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.zIndex = '2147483647';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '5px';
            container.style.alignItems = 'flex-end';

            // Bouton principal (inchangé)
            const torBtn = document.createElement('button');
            torBtn.innerHTML = '🔮 Envoyer vers Tor';
            Object.assign(torBtn.style, {
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

            // NOUVEAU : Bouton RESET
            const resetBtn = document.createElement('button');
            resetBtn.innerHTML = '🗑️ Réinitialiser';
            Object.assign(resetBtn.style, {
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: '#FFFFFF',
                border: '1px solid #bd2130',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'Arial, sans-serif',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                opacity: '0.4',
                transition: 'opacity 0.2s, transform 0.1s'
            });

            // Effets visuels (identiques)
            torBtn.onmouseover = () => torBtn.style.opacity = '1';
            torBtn.onmouseout = () => torBtn.style.opacity = '0.4';
            torBtn.onmousedown = () => torBtn.style.transform = 'scale(0.95)';
            torBtn.onmouseup = () => torBtn.style.transform = 'scale(1)';

            resetBtn.onmouseover = () => resetBtn.style.opacity = '1';
            resetBtn.onmouseout = () => resetBtn.style.opacity = '0.4';
            resetBtn.onmousedown = () => resetBtn.style.transform = 'scale(0.95)';
            resetBtn.onmouseup = () => resetBtn.style.transform = 'scale(1)';

            // Action du bouton principal (inchangée)
            torBtn.onclick = () => {
                if (!torSites.includes(currentHostname)) {
                    torSites.push(currentHostname);
                    GM_setValue("mes_sites_tor", torSites);
                    torBtn.innerHTML = '✅ Ajouté !';
                    torBtn.style.backgroundColor = '#28a745';
                    setTimeout(() => { window.location.reload(); }, 600);
                }
            };

            // NOUVEAU : Action du bouton RESET
            resetBtn.onclick = () => {
                if (confirm('⚠️ Réinitialiser TOUS les sites mémorisés ?')) {
                    resetSites();
                }
            };

            // Ajout des boutons
            container.appendChild(torBtn);
            container.appendChild(resetBtn);
            document.body.appendChild(container);
        });
    }
})();
