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

