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
```markdown
## 🇬🇧 English

**Project**: TopoMar — Coastal Mapping & Water-Level Monitoring (Expo + React Native + TypeScript)

**Description:** TopoMar is a mobile application designed to visualise coastal topography, toponyms and water-level information on-device. It bundles geodata, offline-friendly maps, and simple tools for field capture (camera, location, water-level reading). The app is built with **Expo**, **React Native**, and **TypeScript**.

**Key Features (highlights):**
- **Maps & GeoJSON**: Display of local toponyms and polygon/centroid layers from bundled GeoJSON files.
- **Camera**: Capture geotagged photos for field validation.
- **Water Level**: Record and visualise water-level measurements in the field.
- **Offline-first assets**: Local `src/assets/geodata` included for offline use.
- **Reusable Modal**: A reusable `FeatureModal` component is available at `src/components/FeatureModal.tsx` and used by both `maps` and `camera` screens to display feature detail.
- **Audio Narration**: Per-feature audio files live in `src/assets/audios`. The app uses `expo-audio` when available and falls back to `expo-av` automatically.

### Prerequisites

- Node.js (LTS recommended, >= 16)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`) for device/emulator workflow (recommended)

### Quick Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. (Optional) If you want to ensure the native audio plugin is present, install `expo-audio`:

```bash
expo install expo-audio
# the app will also automatically fallback to expo-av if expo-audio is not available
```

3. Start the development server (with cache clear when changing native modules):

```bash
npx expo start -c
# or
# yarn expo start -c
```

4. Open on a device or emulator (Expo Go or a native build).

### Notes about audio

- Audio assets are located at `src/assets/audios` and an index map `src/assets/audios/index.ts` maps feature names (`properties.nom`) to required assets.
- The modal playback logic will try to use `expo-audio` first (if installed). If `expo-audio` isn't available, the app falls back to `expo-av` at runtime.
- If audio doesn't play for a given feature, check that the `properties.audio` or `properties.nom` value matches a key in `src/assets/audios/index.ts` (keys are the file base names without extension).

### Troubleshooting: common Expo plugin error

If you see an error like:

```
PluginError: Failed to resolve plugin for module "expo-audio" relative to "...". Do you have node modules installed?
```

Try these steps in order:

1. Make sure dependencies are installed:

```bash
npm install
```

2. Clear expo cache and start:

```bash
npx expo start -c
```

3. If problems persist, remove `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start -c
```

4. Run `npx expo doctor` to detect mismatches between SDK and native plugins.

If none of the above resolves the issue, check the exact `expo` SDK version in `package.json` and ensure installed plugin versions are compatible with that SDK.

### Project structure (selected)

- `src/app` — application entry & navigation (tabs: camera, maps, water_level)
- `src/assets/geodata` — bundled GeoJSON files used by the maps
- `src/assets/audios` — audio files and `index.ts` mapping keys to files
- `src/components` — reusable UI components (including `FeatureModal`)
- `src/constants` — app constants (maps_region, camera_settings)
- `src/hooks` — custom hooks (location, data persistence)
- `src/style` — styling system and component styles

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

- **Fonctionnalités principales (points clés) :**
	- **Cartes & GeoJSON :** Affichage local de toponymes et de couches (polygones / centroïdes) à partir de fichiers GeoJSON fournis.
	- **Appareil photo :** Prise de photos géolocalisées pour validation terrain.
	- **Niveau d'eau :** Enregistrement et visualisation des mesures de niveau d'eau.
	- **Ressources hors-ligne :** Les géodonnées sont incluses dans `src/assets/geodata` pour un usage sans connexion.
	- **Modal réutilisable :** Un composant `FeatureModal` réutilisable est disponible dans `src/components/FeatureModal.tsx` et est utilisé par les écrans `maps` et `camera`.
	- **Narration audio :** Les fichiers audio sont dans `src/assets/audios`. L'application utilise `expo-audio` si disponible, et revient à `expo-av` en secours.

### Prérequis

- Node.js (version LTS recommandée, >= 16)
- Yarn ou npm
- Expo CLI (`npm install -g expo-cli`) pour le flux de travail sur appareil / simulateur (recommandé)

### Installation rapide

1. Installer les dépendances :

```bash
npm install
```

2. (Optionnel) Installer `expo-audio` si vous souhaitez forcer l'utilisation du plugin natif audio :

```bash
expo install expo-audio
```

3. Démarrer le serveur de développement (avec purge du cache si modification de modules natifs) :

```bash
npx expo start -c
```

### Remarques audio

- Les fichiers audio se trouvent dans `src/assets/audios` et l'index `src/assets/audios/index.ts` associe les noms de features aux fichiers.
- La lecture tente d'utiliser `expo-audio` en priorité et bascule sur `expo-av` si nécessaire.
- Si un audio ne joue pas, vérifiez que `properties.audio` ou `properties.nom` correspond bien à une clé de `src/assets/audios/index.ts`.

### Dépannage

Voir la section "Troubleshooting" en anglais ci-dessus pour les erreurs courantes liées aux plugins Expo.

---

**Next steps:**
- Review and adapt the `Installation` commands to your CI/CD and build workflows.
- Add a `LICENSE` file if you want to publish with an explicit open-source license.

Thank you for using TopoMar — feel free to request edits to the README or a tailored developer onboarding guide.

````
