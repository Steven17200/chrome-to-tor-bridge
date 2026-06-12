# 📦 Publication GitHub - Chrome to Tor Bridge

Voici tous les fichiers nécessaires pour publier ta procédure sur GitHub. Suis ces étapes pour créer ton dépôt et publier les fichiers.

## 📁 Structure du dépôt

```
chrome-to-tor-bridge/
├── README.md                 # Documentation principale
├── tor-launcher.bat          # Script lanceur système
├── tor-bridge.reg            # Clé de registre Windows
└── auto-open-tor.user.js     # Script Tampermonkey
```

---

## 📄 1. README.md

**Contenu à copier :**

```markdown
# Chrome vers Tor Browser - Passerelle Automatisée

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Guide d'Intégration et Déploiement Local (Google Chrome / Windows)**

Cette documentation technique détaille la mise en place d'une passerelle locale sécurisée permettant de basculer de manière transparente et automatisée du navigateur hôte (Google Chrome) vers l'environnement anonymisé de Tor Browser.

## 📋 Architecture

L'architecture repose sur trois composants interconnectés :

1. **Script Utilisateur (Tampermonkey)** : Intercepte la navigation web sur Chrome selon des critères dynamiques et redirige vers un schéma d'URI personnalisé.
2. **Clé de Registre OS** : Associe le protocole personnalisé `tor-open://` à un script de traitement par lots.
3. **Script Lanceur (.bat)** : Réceptionne l'URI, effectue un nettoyage des chaînes de caractères et initialise Tor Browser.

## 🚀 Installation

### Étape 1 : Création du répertoire de transit

Créez le dossier de travail :
```

C:\TorBridge\n```

### Étape 2 : Script Lanceur Système

Placez le fichier [tor-launcher.bat](./tor-launcher.bat) dans `C:\TorBridge\`

**⚠️ Configuration requise** : Modifiez la ligne 6 du fichier pour indiquer votre nom d'utilisateur Windows à la place de `NOM_UTILISATEUR`.

### Étape 3 : Déclaration du protocole

Double-cliquez sur [tor-bridge.reg](./tor-bridge.reg) et acceptez la fusion dans le Registre Windows.

### Étape 4 : Script Tampermonkey

1. Installez l'extension [Tampermonkey](https://www.tampermonkey.net/) sur Chrome
2. Cliquez sur l'icône Tampermonkey → "Créer un nouveau script"
3. Copiez-collez le contenu de [auto-open-tor.user.js](./auto-open-tor.user.js)
4. Enregistrez (Ctrl+S)

## 📂 Fichiers inclus

- [README.md](./README.md) - Documentation principale
- [tor-launcher.bat](./tor-launcher.bat) - Script lanceur système
- [tor-bridge.reg](./tor-bridge.reg) - Clé de registre pour le protocole
- [auto-open-tor.user.js](./auto-open-tor.user.js) - Script Tampermonkey v2.3

## ⚠️ Notes de sécurité importantes

- **Tor Browser réinitialise son cache et historique** à chaque fermeture pour protéger l'anonymat
- **Ne forcez pas le mode plein écran** : cela désactive le Letterboxing (protection contre le pistage par résolution d'écran)
- Le mode maximisé est **désactivé par défaut** dans le script lanceur
- Au premier lancement, Chrome affichera une boîte de dialogue : **cochez "Toujours autoriser"** pour éviter les interruptions

## 🔧 Persistance des données

Les sites ajoutés via le bouton flottant sont stockés dans Tampermonkey.  
Pour les gérer :

1. Tableau de bord Tampermonkey → Sélectionnez le script
2. Onglet "Stockage / Données"

## 📄 Documentation complète

Cette publication est basée sur la procédure technique complète disponible en PDF.

## 🤝 Contribution

Les contributions sont les bienvenues ! Ouvrez une **Issue** ou soumettez une **Pull Request**.

## 📜 Licence

MIT License © Stéphane Denizault

```

---

## 💻 2. tor-launcher.bat

**Contenu à copier :**

```batch
@echo off
:: Script Lanceur Tor Browser
:: Récupération de l'URI brute envoyée par l'extension Chrome
set "URL=%~1"
:: Nettoyage de la chaîne de caractères : suppression du protocole personnalisé
set "URL=%URL:tor-open://%"
:: Initialisation de Tor Browser avec injection propre de l'URL sécurisée
start "" "C:\Users\NOM_UTILISATEUR\Desktop\Tor Browser\Browser\firefox.exe" "https://%URL%"
```

**⚠️ À modifier :** Remplace `NOM_UTILISATEUR` par ton nom d'utilisateur Windows.

---

## 🔑 3. tor-bridge.reg

**Contenu à copier :**

```reg
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\tor-open]
@="URL:Tor Open Protocol"
"URL Protocol"=""
[HKEY_CLASSES_ROOT\tor-open\shell]
[HKEY_CLASSES_ROOT\tor-open\shell\open]
[HKEY_CLASSES_ROOT\tor-open\shell\open\command]
@="\"C:\\TorBridge\\tor-launcher.bat\" \"%1\""
```

---

## 🎭 4. auto-open-tor.user.js

**Contenu à copier :**

```javascript
// ==UserScript==
// @name         Auto-Ouvrir dans Tor Browser (Chrome) - Public
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bascule vers Tor automatiquement ou propose l'ajout via un bouton flottant en bas à droite
// @author       Stéphane
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Liste de base grand public
    const DEFAULT_SITES = [
        "duckduckgo.com",
        "ahmia.fi",
        "onion.to"
    ];

    let torSites = GM_getValue("mes_sites_tor", DEFAULT_SITES);
    const currentHostname = window.location.hostname;

    function shouldRedirect(hostname) {
        return torSites.some(site => hostname === site || hostname.endsWith('.' + site));
    }

    // CAS 1 : Redirection automatisée immédiate
    if (shouldRedirect(currentHostname)) {
        window.stop();

        const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
        window.location.href = 'tor-open://' + cleanUrl;
        document.documentElement.innerHTML = '
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 100px; color: #2d3748;">
            <h1 style="color: #4a285a;">Transfert vers Tor Browser...</h1>
        </div>';

        setTimeout(() => {
            window.close();
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 100);
        }, 500);
    }
    // CAS 2 : Ajout à la volée via interface utilisateur
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

            torBtn.onclick = () => {
                if (!torSites.includes(currentHostname)) {
                    torSites.push(currentHostname);
                    GM_setValue("mes_sites_tor", torSites);
                    torBtn.innerHTML = '🗑️ Ajouté !';
                    torBtn.style.backgroundColor = '#28a745';
                    setTimeout(() => { window.location.reload(); }, 400);
                }
            };

            document.body.appendChild(torBtn);
        });
    }
})();
```

---

## 🚀 Étapes pour publier sur GitHub

### 1️⃣ Créer le dépôt

1. Rends-toi sur [GitHub](https://github.com) et connecte-toi
2. Clique sur le **+** en haut à droite → **New repository**
3. **Repository name** : `chrome-to-tor-bridge`
4. **Description** : `Passerelle automatisée pour rediriger Chrome vers Tor Browser - Documentation et scripts`
5. **Public** (coché)
6. ✅ **Add a README file** (optionnel, tu peux le créer plus tard)
7. Clique sur **Create repository**

### 2️⃣ Ajouter les fichiers

Tu as deux options :

#### Option A : Via l'interface web

1. Dans ton nouveau dépôt, clique sur **uploading an existing file**
2. Glisse-dépose chaque fichier ou clique pour les sélectionner
3. Ajoute un message de commit (ex: "Ajout des fichiers de la passerelle Tor")
4. Clique sur **Commit changes**

#### Option B : Via Git en local

```bash
# Cloner le dépôt
git clone https://github.com/TON_NOM_UTILISATEUR/chrome-to-tor-bridge.git
cd chrome-to-tor-bridge

# Créer les fichiers (copie le contenu ci-dessus)
# Puis :
git add .
git commit -m "Ajout des fichiers de la passerelle Tor"
git push origin main
```

### 3️⃣ Créer une Release (optionnel)

Pour publier une version officielle :

1. Va dans l'onglet **Releases** de ton dépôt
2. Clique sur **Draft a new release**
3. **Tag version** : `v1.0.0`
4. **Release title** : `Version 1.0.0 - Publication initiale`
5. **Description** : Décris les fonctionnalités
6. Clique sur **Publish release**

---

## 📋 Checklist avant publication

- Remplacer `NOM_UTILISATEUR` dans `tor-launcher.bat`
- Vérifier que tous les fichiers sont présents
- Tester localement avant de publier
- Ajouter une licence (MIT recommandée)

---

## 🎉 C'est prêt !

Une fois publié, tu pourras partager le lien de ton dépôt :  
`https://github.com/TON_NOM_UTILISATEUR/chrome-to-tor-bridge`

N'hésite pas si tu as besoin d'aide pour une des étapes ! 😊
