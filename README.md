<div align="center">

# 🛡️ Chrome to Tor Bridge
**Passerelle automatisée pour naviguer via Tor Browser**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-2.4-blue.svg)](https://github.com/Steven17200/chrome-to-tor-bridge)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-✓-green.svg)](https://tampermonkey.net/)

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---------------|-------------|
| 🌐 **Sélection de pays** | Choisis ton pays de sortie Tor (8 pays disponibles) |
| 🔮 **Redirection automatique** | Les sites enregistrés s'ouvrent directement dans Tor |
| 🗑️ **Réinitialisation** | Bouton pour effacer tous les sites mémorisés |
| 💾 **Mémoire persistante** | Tes préférences sont sauvegardées |
| 🎯 **Interface intuitive** | Menu déroulant + boutons flottants |

---

## 🌍 Pays disponibles
<span style="font-size: 20px;">
  🇩🇪 Allemagne &nbsp;
  🇧🇪 Belgique &nbsp;
  🇺🇸 USA &nbsp;
  🇨🇦 Canada &nbsp;
  🇫🇷 France &nbsp;
  🇳🇱 Pays-Bas &nbsp;
  🇨🇭 Suisse &nbsp;
  🇸🇪 Suède
</span>

---

## 📥 Installation
### Étape 1 : Créer le dossier : C:\TorBridge\
```bash
 Deplacer :  tor-launcher.bat ,  Modifier ligne 22 , remplace NOM_UTILISATEUR par ton nom de session Windows
set "TORRC_DIR=C:\Users\TON_NOM_UTILISATEUR\Desktop\Tor Browser\Browser\TorBrowser\Data\Tor"
        ⚠️   tor-bridge.reg
      Double-clic
      Fusionner dans le registre ⚠️ 

🎬 Aperçu
Interface
Sur n'importe quelle page web :

Sélectionne un pays dans le menu déroulant
Clique sur "🔮 Envoyer vers Tor"
Le site s'ouvre dans Tor Browser avec le circuit du pays choisi
Pour réinitialiser :

Clique sur "🗑️ Réinitialiser" → Confirmation → Tous les sites mémorisés sont effacés

⚠️ Notes de sécurité

⚠️ Tor Browser réinitialise son cache à chaque fermeture pour protéger ton anonymat.
🔒 Ne force pas le plein écran : cela désactive le Letterboxing (protection contre le pistage).
📋 Première utilisation : Chrome demandera confirmation pour le protocole tor-open:// → coche "Toujours autoriser".

🎬 Aperçu
Interface
Sur n'importe quelle page web :

Sélectionne un pays dans le menu déroulant
Clique sur "🔮 Envoyer vers Tor"
Le site s'ouvre dans Tor Browser avec le circuit du pays choisi
Pour réinitialiser :

Clique sur "🗑️ Réinitialiser" → Confirmation → Tous les sites mémorisés sont effacés

⚠️ Notes de sécurité

⚠️ Tor Browser réinitialise son cache à chaque fermeture pour protéger ton anonymat.
🔒 Ne force pas le plein écran : cela désactive le Letterboxing (protection contre le pistage).
📋 Première utilisation : Chrome demandera confirmation pour le protocole tor-open:// → coche "Toujours autoriser".


🤝 Contribution
Les contributions sont les bienvenues ! Ouvrez une Issue ou soumettez une Pull Request.

### Étape 1 : Prérequis
```bash
Créer le dossier : C:\TorBridge\
