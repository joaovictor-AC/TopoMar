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
