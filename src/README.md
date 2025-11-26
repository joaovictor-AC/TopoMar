# src — Directory structure (English / Français)

This file documents the `src` folder with short descriptions and examples of the key files in each directory, to help developer onboarding and navigation.

## 🇬🇧 English

```
src/
├─ app/                      # App entry and navigation (layouts and main screens)
│  ├─ (tabs)/                # Tab-organised routes
│  │  ├─ (camera)/           # Camera screen and capture logic — example: `camera.tsx`
│  │  ├─ (maps)/             # Maps screen and layers — example: `maps.tsx`
│  │  └─ (water_level)/      # Water-level screen — example: `level.tsx`
│  ├─ _layout.tsx            # Main layout / shell
	│  └─ index.tsx            # Navigation entry for `src/app`
│
├─ assets/                   # Static assets: images, GeoJSON and other resources
│  ├─ geodata/               # GeoJSON files used by maps — examples:
│  │    - `4G6NZVR0_Height_Toponymes.json`
│  │    - `4G6NZVR0_Toponymes (1).geojson`
│  │    - `IMT_EntitesRemarquables.json`
│  │    - `KERLOUAN_ILOTS_CENTROID.json`
│  │    - `KERLOUAN_ILOTS_POLYGON.json`
│  └─ images/                # UI images and icons — examples: `logo.png`, `splash_screen.png`
│
├─ components/               # Reusable React components — examples: `loadingScreen.tsx`, `splashScreen.tsx`
│
├─ constants/                # App constants and config values — examples: `camera_settings.ts`, `maps_region.ts`, `height.ts`, `phone_dimensions.ts`
│
├─ hooks/                    # Custom hooks for shared logic — examples: `useLocation.ts`, `useDataPersistence.ts`, `useDeviceOrietation.ts`
│
├─ style/                    # Styling system and per-component styles
│  ├─ button/                # `button_style.ts`
│  ├─ card/                  # `card_style.ts`
│  ├─ footer/                # `footer_style.ts`
│  ├─ icon/                  # `icon_style.ts`
│  ├─ marker/                # `marker_style.ts`
│  ├─ screen/                # `screen_style.ts`
│  ├─ stats/                 # `stats_style.ts`
│  └─ text/                  # `text_style.ts`
│
├─ types/                    # TypeScript types and interfaces — example: `locationTypes.ts`
│
└─ utils/                    # Utility functions — examples: `calcHeight.ts`, `calcLocation.ts`

```

### How to use
- Open `src/app` to inspect navigation and the main screens.
- Inspect `src/assets/geodata` to review the GeoJSON layers that feed the maps.
- Check `src/hooks` for reusable logic (location, persistence, device orientation).

## 🇫🇷 Français

```
src/
├─ app/                      # Entrée de l'application et navigation (layouts et écrans principaux)
│  ├─ (tabs)/                # Routes organisées par onglets
│  │  ├─ (camera)/           # Écran caméra et logique de capture — exemple : `camera.tsx`
│  │  ├─ (maps)/             # Écran cartes et couches — exemple : `maps.tsx`
│  │  └─ (water_level)/      # Écran niveau d'eau — exemple : `level.tsx`
│  ├─ _layout.tsx            # Layout principal
	│  └─ index.tsx            # Point d'entrée de navigation pour `src/app`
│
├─ assets/                   # Ressources statiques : images, GeoJSON et autres
│  ├─ geodata/               # Fichiers GeoJSON utilisés par les cartes — exemples :
│  │    - `4G6NZVR0_Height_Toponymes.json`
│  │    - `4G6NZVR0_Toponymes (1).geojson`
│  │    - `IMT_EntitesRemarquables.json`
│  │    - `KERLOUAN_ILOTS_CENTROID.json`
│  │    - `KERLOUAN_ILOTS_POLYGON.json`
│  └─ images/                # Images et icônes — exemples : `logo.png`, `splash_screen.png`
│
├─ components/               # Composants React réutilisables — exemples : `loadingScreen.tsx`, `splashScreen.tsx`
│
├─ constants/                # Constantes et valeurs de configuration — exemples : `camera_settings.ts`, `maps_region.ts`, `height.ts`, `phone_dimensions.ts`
│
├─ hooks/                    # Hooks personnalisés pour logique partagée — exemples : `useLocation.ts`, `useDataPersistence.ts`, `useDeviceOrietation.ts`
│
├─ style/                    # Système de styles et styles par composant
│  ├─ button/                # `button_style.ts`
│  ├─ card/                  # `card_style.ts`
│  ├─ footer/                # `footer_style.ts`
│  ├─ icon/                  # `icon_style.ts`
│  ├─ marker/                # `marker_style.ts`
│  ├─ screen/                # `screen_style.ts`
│  ├─ stats/                 # `stats_style.ts`
│  └─ text/                  # `text_style.ts`
│
├─ types/                    # Types TypeScript et interfaces — exemple : `locationTypes.ts`
│
└─ utils/                    # Fonctions utilitaires — exemples : `calcHeight.ts`, `calcLocation.ts`

```

### Comment l'utiliser
- Ouvrez `src/app` pour consulter la navigation et les écrans principaux.
- Consultez `src/assets/geodata` pour examiner les fichiers GeoJSON qui alimentent les cartes.
- Regardez `src/hooks` pour la logique réutilisable (localisation, persistance, orientation du dispositif).