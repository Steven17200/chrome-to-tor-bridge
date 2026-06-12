// ==UserScript==
// @name         Auto-Ouvrir dans Tor Browser (Chrome) - Dynamique
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Bascule vers Tor automatiquement ou propose l'ajout via un bouton flottant avec sélection de pays et reset
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torproject.org
// @author       Stéphane
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Sites de base
    const DEFAULT_SITES = ["onion.to", "ahmia.fi", "duckduckgo.com"];
    let torSites = GM_getValue("mes_sites_tor", DEFAULT_SITES);
    let defaultCountry = GM_getValue("default_country", "auto");
    const currentHostname = window.location.hostname;

    // Liste des pays disponibles
    const COUNTRIES = {
        'auto': { name: 'Auto (circuit aléatoire)', emoji: '🌍' },
        'de': { name: 'Allemagne', emoji: '🇩🇪' },
        'be': { name: 'Belgique', emoji: '🇧🇪' },
        'us': { name: 'USA', emoji: '🇺🇸' },
        'ca': { name: 'Canada', emoji: '🇨🇦' },
        'fr': { name: 'France', emoji: '🇫🇷' },
        'nl': { name: 'Pays-Bas', emoji: '🇳🇱' },
        'ch': { name: 'Suisse', emoji: '🇨🇭' },
        'se': { name: 'Suède', emoji: '🇸🇪' }
    };

    function shouldRedirect(hostname) {
        return torSites.some(site => hostname === site || hostname.endsWith('.' + site));
    }

    function resetSites() {
        GM_setValue("mes_sites_tor", DEFAULT_SITES);
        window.location.reload();
    }

    // CAS 1 : Redirection immédiate
    if (shouldRedirect(currentHostname)) {
        window.stop();
        const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
        const countryParam = defaultCountry !== "auto" ? "&country=" + defaultCountry : "";
        window.location.href = 'tor-open://' + cleanUrl + countryParam;

        document.documentElement.innerHTML = `
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; color: #2d3748;">
                <h1 style="color: #4a285a;">🚀 Redirection vers Tor Browser...</h1>
                <p style="font-size: 18px;">Veuillez cliquer sur <b>"Ouvrir Tor Open Protocol"</b> dans la fenêtre Chrome.</p>
                <p style="color: #718096;"><i>Cet onglet se fermera automatiquement dans 10 secondes.</i></p>
            </div>
        `;
        setTimeout(() => { window.close(); }, 10000);
    }
    // CAS 2 : Boutons avec menu pays
    else {
        window.addEventListener('DOMContentLoaded', () => {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.bottom = '20px';
            container.style.right = '20px';
            container.style.zIndex = '2147483647';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '5px';
            container.style.alignItems = 'flex-end';

            // Menu pays
            const countrySelect = document.createElement('select');
            Object.assign(countrySelect.style, {
                padding: '6px 10px',
                backgroundColor: '#59316B',
                color: '#FFFFFF',
                border: '1px solid #4a285a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                width: '100%',
                opacity: '0.9'
            });

            for (const [code, country] of Object.entries(COUNTRIES)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = country.emoji + ' ' + country.name;
                option.style.color = '#FFFFFF';
                if (code === defaultCountry) option.selected = true;
                countrySelect.appendChild(option);
            }

            countrySelect.addEventListener('change', () => {
                defaultCountry = countrySelect.value;
                GM_setValue("default_country", defaultCountry);
            });

            // Bouton Envoyer vers Tor
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
                opacity: '0.9',
                transition: 'opacity 0.2s, transform 0.1s'
            });

            // Bouton Reset
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
                opacity: '0.9',
                transition: 'opacity 0.2s, transform 0.1s'
            });

            // Effets visuels
            [torBtn, resetBtn, countrySelect].forEach(el => {
                el.onmouseover = () => el.style.opacity = '1';
                el.onmouseout = () => el.style.opacity = '0.9';
            });
            [torBtn, resetBtn].forEach(el => {
                el.onmousedown = () => el.style.transform = 'scale(0.95)';
                el.onmouseup = () => el.style.transform = 'scale(1)';
            });

            // Actions
            torBtn.onclick = () => {
                if (!torSites.includes(currentHostname)) {
                    torSites.push(currentHostname);
                    GM_setValue("mes_sites_tor", torSites);
                    torBtn.innerHTML = '✅ Ajouté !';
                    torBtn.style.backgroundColor = '#28a745';
                    setTimeout(() => { window.location.reload(); }, 600);
                }
            };

            resetBtn.onclick = () => {
                if (confirm('⚠️ Réinitialiser TOUS les sites mémorisés ?')) {
                    resetSites();
                }
            };

            container.appendChild(countrySelect);
            container.appendChild(torBtn);
            container.appendChild(resetBtn);
            document.body.appendChild(container);
        });
    }
})();
