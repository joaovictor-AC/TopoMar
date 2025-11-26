## 🇬🇧 English

**Project**: TopoMar — Coastal Mapping & Water-Level Monitoring (Expo + React Native + TypeScript)

- **Description:** TopoMar is a mobile application designed to visualise coastal topography, toponyms and water-level information on-device. It bundles geodata, offline-friendly maps, and simple tools for field capture (camera, location, water-level reading). The app is built with **Expo**, **React Native**, and **TypeScript**.

- **Key Features:**
	- **Maps & GeoJSON**: Display of local toponyms and polygon/centroid layers from bundled GeoJSON files.
	- **Camera**: Capture geotagged photos for field validation.
	- **Water Level**: Record and visualise water-level measurements in the field.
	- **Offline-first assets**: Local `assets/geodata` included for offline use.

### Prerequisites

- Node.js (LTS recommended, >= 16)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`) for device/emulator workflow

### Quick Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npx expo start
# or
yarn expo start
```

3. Open on a device or emulator (Expo Go or a native build).

### Project Structure (selected)

- `src/app` — application entry & navigation (tabs: camera, maps, water_level)
- `src/assets/geodata` — bundled GeoJSON files used by the maps
- `src/components` — reusable UI components (loadingScreen, splashScreen)
- `src/constants` — app constants (maps_region, camera_settings)
- `src/hooks` — custom hooks (location, data persistence)
- `src/style` — styling system and component styles

### Project structure (simplified)

```
src/
├─ app/        # navigation & main screens
├─ assets/     # images, GeoJSON
├─ components/ # reusable UI components
├─ constants/  # configuration constants
├─ hooks/      # custom hooks
├─ style/      # styling and theme
├─ types/      # TypeScript types
└─ utils/      # utility functions
```

### Environment & Configuration

- `app.json` is used by Expo. Adjust app identifiers and permissions there.
- If your workflow requires secrets or keys, add them securely (do not commit to the repo). Prefer `.env` files or the platform's secret storage.

### Data

- GeoJSON assets are in `src/assets/geodata`. They are intended to be viewable offline and include layers such as toponyms, polygons and centroids.

### Contributing

- Fork the repository, create a feature branch, run tests and open a merge request with a clear description of the change.
- Follow existing code style (TypeScript + React Native idioms). Keep changes small and well documented.

### License

- If a `LICENSE` file exists in this repository, that license applies. If no license is present, contact the repository owner to clarify permitted usage. Consider adding an open-source license such as MIT or Apache-2.0.

### Contact & Support

- Maintainer: repository owner (`joaovictor-AC`) — open an issue for bug reports and feature requests.

---

## 🇫🇷 Français

- **Projet :** TopoMar — Cartographie côtière et surveillance du niveau de l'eau (Expo + React Native + TypeScript)

- **Description :** TopoMar est une application mobile destinée à visualiser la topographie côtière, les toponymes et les relevés de niveau d'eau. Elle intègre des données géographiques, des cartes utilisables hors-ligne et des outils simples pour la capture sur le terrain (appareil photo, localisation, relevés de niveau).

- **Fonctionnalités principales :**
	- **Cartes & GeoJSON :** Affichage local de toponymes et de couches (polygones / centroïdes) à partir de fichiers GeoJSON fournis.
	- **Appareil photo :** Prise de photos géolocalisées pour validation terrain.
	- **Niveau d'eau :** Enregistrement et visualisation des mesures de niveau d'eau.
	- **Ressources hors-ligne :** Les géodonnées sont incluses dans `src/assets/geodata` pour un usage sans connexion.

### Prérequis

- Node.js (version LTS recommandée, >= 16)
- Yarn ou npm
- Expo CLI (`npm install -g expo-cli`) pour le flux de travail sur appareil / simulateur

### Installation rapide

1. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

2. Démarrer le serveur de développement :

```bash
npx expo start
# ou
yarn expo start
```

3. Ouvrir sur un appareil ou un émulateur (Expo Go ou build natif).

### Structure du projet (sélection)

- `src/app` — point d'entrée et navigation (onglets : camera, maps, water_level)
- `src/assets/geodata` — fichiers GeoJSON inclus utilisés par les cartes
- `src/components` — composants réutilisables (loadingScreen, splashScreen)
- `src/constants` — constantes de l'application (maps_region, camera_settings)
- `src/hooks` — hooks personnalisés (location, data persistence)
- `src/style` — système de styles et styles de composants

### Structure du projet (simplifiée)

```
src/
├─ app/        # navigation et écrans principaux
├─ assets/     # images, GeoJSON
├─ components/ # composants réutilisables
├─ constants/  # constantes de configuration
├─ hooks/      # hooks personnalisés
├─ style/      # styles et thème
├─ types/      # types TypeScript
└─ utils/      # fonctions utilitaires
```

### Configuration & variables

- `app.json` est utilisé par Expo — ajustez les identifiants et permissions si nécessaire.
- Pour les secrets/clés, utilisez des fichiers `.env` ou le stockage sécurisé de la plateforme et n'engagez jamais d'informations sensibles dans le dépôt.

### Données

- Les GeoJSON sont situés dans `src/assets/geodata`. Ils servent à l'affichage hors-ligne des couches cartographiques.

### Contribution

- Forkez le dépôt, créez une branche feature, exécutez les tests et ouvrez une merge request avec une description claire.
- Respectez le style TypeScript + React Native existant. Préférez des changements petits et bien documentés.

### Licence

- Si un fichier `LICENSE` est présent, il s'applique. Sinon, contactez le propriétaire pour clarifier les conditions d'utilisation. Envisagez d'ajouter une licence open-source (par ex. MIT ou Apache-2.0).

### Contact & Support

- Mainteneur : propriétaire du dépôt (`joaovictor-AC`) — ouvrez une issue pour signaler un bug ou proposer une fonctionnalité.

---

**Next steps:**
- Review and adapt the `Installation` commands to your CI/CD and build workflows.
- Add a `LICENSE` file if you want to publish with an explicit open-source license.

Thank you for using TopoMar — feel free to request edits to the README or a tailored developer onboarding guide.
