# Fuentes para TopoMar - KERREGVIEW

## 📁 Añade las Fuentes Aquí

Para que el Splash Screen 2 se vea correctamente, necesitas añadir la fuente **Instrument Serif**.

### 🔍 Cómo Obtener la Fuente

#### Opción 1: Desde Google Fonts (Gratis)

1. **Ve a:** https://fonts.google.com/specimen/Instrument+Serif
2. **Click en:** "Download family"
3. **Descomprime el ZIP**
4. **Copia:** `InstrumentSerif-Regular.ttf` a esta carpeta

#### Opción 2: Desde Figma

1. **En Figma:** Selecciona el texto "Toponymes d'hier..."
2. **Panel derecho:** Mira la fuente usada
3. **Descarga la fuente** desde el sitio del proveedor
4. **Copia el archivo .ttf** a esta carpeta

#### Opción 3: Usar Fuente del Sistema (Temporal)

Si no tienes la fuente, puedes usar una alternativa temporal:

En `src/components/SplashScreen/CustomSplashScreen.tsx`, cambia:
```typescript
fontFamily: 'System',  // En lugar de 'Instrument Serif'
```

### 📦 Archivos Necesarios

Añade estos archivos a esta carpeta:

```
assets/fonts/
  └── InstrumentSerif-Regular.ttf  ← Fuente principal
```

Si tienes variantes (opcional):
```
assets/fonts/
  ├── InstrumentSerif-Regular.ttf
  ├── InstrumentSerif-Italic.ttf
  └── InstrumentSerif-Bold.ttf
```

### ✅ Después de Añadir la Fuente

1. Reinicia la app: `npm start -- --clear`
2. La fuente se cargará automáticamente
3. El Splash Screen 2 mostrará el texto correctamente

### ⚠️ Si Prefieres No Usar Fuentes Personalizadas

Puedes usar fuentes del sistema que se ven similares:

**iOS:**
- 'Georgia' (serif elegante)
- 'Times New Roman'
- 'Baskerville'

**Android:**
- 'serif' (fuente por defecto)
- 'Roboto Serif'

**Multiplataforma:**
```typescript
fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif'
```

---

**Siguiente paso:** Descarga la fuente y cópiala aquí, o dime si prefieres usar una alternativa del sistema.
