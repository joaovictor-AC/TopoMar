
# `src` — Directory structure (English)

This file documents the `src` folder with a quick overview of the main directories and files to help navigation and onboarding.

Summary tree:

```
src/
├─ app/                      # App entry and routes (layout and main screens)
│  ├─ (tabs)/                # Tab-organised routes
│  │  ├─ (camera)/           # Camera screen and capture logic (`camera.tsx`)
│  │  ├─ (maps)/             # Maps screen and layers (`maps.tsx`)
│  │  └─ (water_level)/      # Water-level screen (`level.tsx`)
│  ├─ _layout.tsx            # Main layout / shell
│  └─ index.tsx              # Navigation entry for `src/app`
│
├─ assets/                   # Static assets: images, GeoJSON, audio
│  ├─ audios/                # Audio assets (exports in `index.ts`)
│  ├─ geodata/               # GeoJSON and geographic data used by maps
│  └─ images/                # UI images and icons
│
├─ components/               # Reusable React components (e.g. `FeatureModal.tsx`, `loadingScreen.tsx`)
│
├─ constants/                # App constants and configuration (e.g. `camera_settings.ts`, `maps_region.ts`)
│
├─ hooks/                    # Custom hooks (e.g. `useLocation.ts`, `useDataPersistence.ts`, `useDeviceOrietation.ts`)
│
├─ style/                    # Styling system and per-component styles (button, card, modal, marker, etc.)
│
├─ types/                    # TypeScript types and interfaces (e.g. `locationTypes.ts`, `modalTypes.ts`)
│
└─ utils/                    # Utility functions (e.g. `calcHeight.ts`, `calcLocation.ts`)

```

What to notice
- `src/app`: starting point to explore app routes and screens.
- `src/assets/geodata`: contains GeoJSON files that feed the map layers.
- `src/assets/audios/index.ts`: centralizes audio resources used by the app.
- `src/components/FeatureModal.tsx`: reusable modal to show feature details (used by map/water-level screens).
- `src/hooks`: reusable logic (location, local persistence, device orientation).
- `src/constants` and `src/style`: centralize configuration and styling for consistent UI.

How to run the project (development)
- Prerequisites: Node.js (>= 18 recommended), Yarn or npm, Expo CLI (optional but helpful).
- Install dependencies:

```bash
npm install
# or
yarn
```

- Start the Metro / Expo dev server:

```bash
npm run start
# or
yarn start
```

Useful commands (from `package.json`):

- `npm run start` — start Expo Dev Server
- `npm run android` — open on Android emulator/device
- `npm run ios` — open on iOS emulator/device
- `npm run web` — run web version
- `npm run lint` — run linter via Expo

Quick technical notes
- Expo SDK version is defined in `package.json`; check it for exact versions.
- Maps: the project uses `react-native-maps` and `expo-maps`; GeoJSON is loaded from `src/assets/geodata`.
- Camera: `expo-camera` is used for media capture in the camera tab.
- Persistence: `useDataPersistence.ts` centralizes local read/write (AsyncStorage / file-system depending on implementation).

Contributing / workflow
- Create a descriptive branch for your work.
- Open small, focused PRs.
- Run `npm run lint` before opening a PR.

Where to look first when developing
- Map features: `src/app/(tabs)/(maps)/maps.tsx` and `src/assets/geodata`.
- Media capture: `src/app/(tabs)/(camera)/camera.tsx` and `src/constants/camera_settings.ts`.
- UI and styles: `src/style/` and `src/components`.

---

# `src` — Structure du répertoire (Français)

Ce fichier documente le dossier `src` avec une vue d'ensemble rapide des principaux répertoires et fichiers pour faciliter la navigation et l'onboarding.

Arborescence résumée :

```
src/
├─ app/                      # Entrée de l'application et routes (layout et écrans principaux)
│  ├─ (tabs)/                # Routes organisées par onglets
│  │  ├─ (camera)/           # Écran caméra et logique de capture (`camera.tsx`)
│  │  ├─ (maps)/             # Écran cartes et couches (`maps.tsx`)
│  │  └─ (water_level)/      # Écran niveau d'eau (`level.tsx`)
│  ├─ _layout.tsx            # Layout principal / shell
│  └─ index.tsx              # Point d'entrée de navigation pour `src/app`
│
├─ assets/                   # Ressources statiques : images, GeoJSON, audio
│  ├─ audios/                # Fichiers audio (exports dans `index.ts`)
│  ├─ geodata/               # GeoJSON et données géographiques utilisées par les cartes
│  └─ images/                # Images et icônes de l'interface
│
├─ components/               # Composants React réutilisables (ex. `FeatureModal.tsx`, `loadingScreen.tsx`)
│
├─ constants/                # Constantes et configurations (ex. `camera_settings.ts`, `maps_region.ts`)
│
├─ hooks/                    # Hooks personnalisés (ex. `useLocation.ts`, `useDataPersistence.ts`, `useDeviceOrietation.ts`)
│
├─ style/                    # Système de styles et styles par composant (button, card, modal, marker, etc.)
│
├─ types/                    # Types TypeScript et interfaces (ex. `locationTypes.ts`, `modalTypes.ts`)
│
└─ utils/                    # Fonctions utilitaires (ex. `calcHeight.ts`, `calcLocation.ts`)

```

Points importants
- `src/app` : point de départ pour explorer les routes et écrans de l'application.
- `src/assets/geodata` : contient les fichiers GeoJSON qui alimentent les couches de la carte.
- `src/assets/audios/index.ts` : centralise les ressources audio utilisées par l'application.
- `src/components/FeatureModal.tsx` : modal réutilisable pour afficher les détails d'une entité (utilisé dans les écrans carte / niveau d'eau).
- `src/hooks` : logique réutilisable (localisation, persistance locale, orientation de l'appareil).
- `src/constants` et `src/style` : centralisent la configuration et les styles pour une UI cohérente.

Comment exécuter le projet (développement)
- Pré-requis : Node.js (>= 18 recommandé), Yarn ou npm, Expo CLI (optionnel).
- Installer les dépendances :

```bash
npm install
# ou
yarn
```

- Démarrer le serveur Metro / Expo :

```bash
npm run start
# ou
yarn start
```

Commandes utiles (dans `package.json`) :

- `npm run start` — démarre Expo Dev Server
- `npm run android` — lance sur émulateur/appareil Android
- `npm run ios` — lance sur émulateur/appareil iOS
- `npm run web` — lance la version web
- `npm run lint` — exécute le linter via Expo

Notes techniques rapides
- La version du SDK Expo est indiquée dans `package.json`; vérifiez-la pour les versions exactes.
- Cartes : le projet utilise `react-native-maps` et `expo-maps`; les GeoJSON sont chargés depuis `src/assets/geodata`.
- Caméra : `expo-camera` est utilisé pour la capture média dans l'onglet caméra.
- Persistance : `useDataPersistence.ts` centralise les lectures/écritures locales (AsyncStorage / file-system selon l'implémentation).

Contribuer / workflow
- Créez une branche descriptive pour votre travail.
- Ouvrez de petites PRs ciblées.
- Lancez `npm run lint` avant d'ouvrir une PR.

Où regarder en priorité
- Fonctionnalités de carte : `src/app/(tabs)/(maps)/maps.tsx` et `src/assets/geodata`.
- Capture média : `src/app/(tabs)/(camera)/camera.tsx` et `src/constants/camera_settings.ts`.
- UI / styles : `src/style/` et `src/components`.

---