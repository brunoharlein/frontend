# Frontend

# Passkeys Frontend (Angular) – POC

Ce projet est un **frontend Angular** de démonstration pour une authentification **sans mot de passe** via **Passkeys (WebAuthn)**.

Il fournit une petite interface (email + boutons) qui permet de :
- **Register** : créer une Passkey sur l’appareil (Touch ID / Face ID / PIN)
- **Login** : se connecter avec cette Passkey
- Afficher les réponses JSON (logs) renvoyées par l’API backend

> ⚠️ WebAuthn/Passkeys fonctionne côté navigateur uniquement. Ce POC est donc conçu pour tourner en mode SPA (pas SSR).

---

## Fonctionnement (résumé)

Le frontend appelle un backend (API) qui expose des endpoints WebAuthn :
- `POST /webauthn/register/start`
- `POST /webauthn/register/finish`
- `POST /webauthn/login/start`
- `POST /webauthn/login/finish`

Le navigateur utilise ensuite l’API WebAuthn native :
- `navigator.credentials.create()` pour l’enregistrement
- `navigator.credentials.get()` pour l’authentification

---

## Pré-requis

- Node.js (idéalement **LTS** : Node 20 ou 22)
- npm (ou pnpm/yarn si tu préfères)
- Un backend lancé en local (voir ci-dessous)

---

## Lancer le projet en local

### 1) Installer les dépendances

```bash
npm install

2) Vérifier le proxy vers le backend
Ce projet utilise un proxy Angular pour éviter le CORS en développement.
Fichier : proxy.conf.json
Exemple attendu :
{
  "/webauthn": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  },
  "/auth": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
✅ Le backend doit donc tourner sur http://localhost:8000.
3) Lancer le serveur Angular
npm start
Puis ouvrir :
http://localhost:4200
Lancer le backend (rappel)
Le backend (Symfony API) doit être accessible sur :
http://localhost:8000
Exemple (serveur PHP simple) :
php -S localhost:8000 -t public
Test rapide (workflow)
Ouvrir l’UI Angular (http://localhost:4200)
Saisir un email (ex : test@asso.fr)
Cliquer Register et valider la biométrie (Touch ID / Face ID / PIN)
Cliquer Login et valider à nouveau
Observer les logs JSON en bas de page (résultats API)
Notes importantes
Utiliser localhost partout (frontend + backend) pour éviter des problèmes de “RP ID” WebAuthn.
En production, il faudra :
stocker les credentials en base
valider cryptographiquement côté serveur avec une librairie WebAuthn complète
gérer plusieurs passkeys par utilisateur
prévoir un fallback (ex : magic link email)
Structure (repères)
src/app/passkeys/ : composant UI (email + register/login + logs)
src/app/passkeys.service.ts : service qui gère WebAuthn + appels API
proxy.conf.json : proxy dev vers le backend

