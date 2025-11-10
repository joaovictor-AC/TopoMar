# TopoMar 🌊

Mobile application for topography and sea level measurement.

## 📱 Description

TopoMar is an application developed with React Native and Expo that integrates camera, maps, and water level measurement functionalities for marine topography tasks.

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the application

```bash
npm start
```

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## 🎨 Figma Integration

This project is configured for Figma integration. For more information:

📖 **[View Figma Integration Guide](./docs/FIGMA_INTEGRATION.md)**

### Quick Setup

1. **Install Figma extension in VS Code** (already installed)
2. **Sign in**: `Ctrl+Shift+P` → "Figma: Login"
3. **Open your Figma file**: `Ctrl+Shift+P` → "Figma: Open File"
4. **Copy designs**: Right click → "Copy as React Native"

### Recommended Extensions

- **Figma for VS Code** ✅ (installed)
- **Kombai** - Figma to React Native (recommended)
- **Anima (Frontier)** - Design to Code
- **Locofy.ai** - Frontend development accelerated

## 📂 Project Structure

```
TopoMar/
├── src/
│   ├── app/                    # Navigation (Expo Router)
│   │   ├── index.tsx          # Main screen
│   │   ├── _layout.tsx        # Root layout
│   │   └── (tabs)/            # Navigation tabs
│   │
│   ├── components/            # Reusable components
│   │   ├── Button/           # Custom buttons
│   │   ├── Card/             # Content cards
│   │   ├── Input/            # Input fields
│   │   └── README.md         # Components documentation
│   │
│   ├── style/                # Styles and themes
│   │   ├── theme.ts         # Design tokens
│   │   └── splash_screen.ts # Splash configuration
│   │
│   ├── hooks/                # Custom React Hooks
│   ├── utils/                # Utilities
│   ├── types/                # TypeScript types
│   └── assets/               # Static resources
│
├── .figmarc.json             # Figma configuration
└── docs/                     # Documentation
    └── FIGMA_INTEGRATION.md  # Figma integration guide
```

## 🎯 Main Features

- 📸 **Camera** - Image capture and processing
- 🗺️ **Maps** - Geographic data visualization
- 🌊 **Water Level** - Measurement and tracking

## 🛠️ Technologies

- React Native + Expo
- TypeScript
- Expo Router (File-based routing)
- React Native Maps
- Expo Camera & Location

## 📦 Available Scripts

```bash
npm start          # Start development server
npm run android    # Start on Android
npm run ios        # Start on iOS
npm run web        # Start on web
npm run lint       # Run linting
```

## 🎨 Design System

Uses centralized design tokens in `src/style/theme.ts`:

```typescript
import { theme } from '@/style/theme';

// Colors, typography, spacing, etc.
theme.colors.primary.main
theme.typography.fontSize.md
theme.spacing.lg
```

View complete documentation in [`src/components/README.md`](./src/components/README.md)

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Figma Integration Guide](./docs/FIGMA_INTEGRATION.md)

---

**Last update**: November 2025
