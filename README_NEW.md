# TopoMar 🌊

Aplicación móvil para topografía y medición del nivel del mar.

## 📱 Descripción

TopoMar es una aplicación desarrollada con React Native y Expo que integra funcionalidades de cámara, mapas y medición de niveles de agua para tareas de topografía marina.

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar la aplicación

```bash
npm start
```

En la salida, encontrarás opciones para abrir la aplicación en:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador de Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador de iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## 🎨 Integración con Figma

Este proyecto está configurado para integración con Figma. Para más información:

📖 **[Ver Guía de Integración Figma](./docs/FIGMA_INTEGRATION.md)**

### Configuración Rápida

1. **Instalar extensión de Figma en VS Code** (ya instalada)
2. **Iniciar sesión**: `Ctrl+Shift+P` → "Figma: Login"
3. **Abrir tu archivo de Figma**: `Ctrl+Shift+P` → "Figma: Open File"
4. **Copiar diseños**: Click derecho → "Copy as React Native"

### Extensiones Recomendadas

- **Figma for VS Code** ✅ (instalada)
- **Kombai** - Figma to React Native (recomendada)
- **Anima (Frontier)** - Design to Code
- **Locofy.ai** - Frontend development accelerated

## 📂 Estructura del Proyecto

```
TopoMar/
├── src/
│   ├── app/                    # Navegación (Expo Router)
│   │   ├── index.tsx          # Pantalla principal
│   │   ├── _layout.tsx        # Layout raíz
│   │   └── (tabs)/            # Pestañas de navegación
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── Button/           # Botones personalizados
│   │   ├── Card/             # Tarjetas de contenido
│   │   ├── Input/            # Campos de entrada
│   │   └── README.md         # Documentación de componentes
│   │
│   ├── style/                # Estilos y temas
│   │   ├── theme.ts         # Design tokens
│   │   └── splash_screen.ts # Configuración de splash
│   │
│   ├── hooks/                # React Hooks personalizados
│   ├── utils/                # Utilidades
│   ├── types/                # TypeScript types
│   └── assets/               # Recursos estáticos
│
├── .figmarc.json             # Configuración de Figma
└── docs/                     # Documentación
    └── FIGMA_INTEGRATION.md  # Guía de integración Figma
```

## 🎯 Características Principales

- 📸 **Cámara** - Captura y procesamiento de imágenes
- 🗺️ **Mapas** - Visualización de datos geográficos
- 🌊 **Nivel del Agua** - Medición y seguimiento

## 🛠️ Tecnologías

- React Native + Expo
- TypeScript
- Expo Router (File-based routing)
- React Native Maps
- Expo Camera & Location

## 📦 Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run android    # Iniciar en Android
npm run ios        # Iniciar en iOS
npm run web        # Iniciar en web
npm run lint       # Ejecutar linting
```

## 🎨 Sistema de Design

Utiliza design tokens centralizados en `src/style/theme.ts`:

```typescript
import { theme } from '@/style/theme';

// Colores, tipografía, espaciado, etc.
theme.colors.primary.main
theme.typography.fontSize.md
theme.spacing.lg
```

Ver documentación completa en [`src/components/README.md`](./src/components/README.md)

## 📚 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Guía de Integración Figma](./docs/FIGMA_INTEGRATION.md)

---

**Última actualización**: Octubre 2025
