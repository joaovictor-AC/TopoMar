# 🎯 Mejoras de Nivelación AR - Cámara TopoMar

## 📋 Resumen de Cambios

Se implementaron mejoras significativas en el sistema de posicionamiento AR para resolver tres problemas principales:
1. **Nivelación incorrecta** de etiquetas (no consideraban altitud real)
2. **Movimiento rápido/nervioso** de las etiquetas
3. **Colapso de etiquetas** superpuestas

---

## 🔧 Cambios Implementados

### 1️⃣ **Proyección Vertical Correcta con Altitud Real**

#### ❌ **Antes:**
```typescript
// Ángulo vertical siempre era 0° (horizonte)
const expectedVerticalAngle = Math.atan2(0, distance) * (180 / Math.PI);

// Posición Y basada solo en distancia horizontal
const distanceOffset = distanceFactor * (HEIGHT_SCREEN * 0.2);
const screenY = centerY - distanceOffset + pitchOffset;
```

**Problema:** No consideraba si el rocher estaba arriba o abajo del usuario.

#### ✅ **Ahora:**
```typescript
// Calcula diferencia de altura REAL
const userAltitude = location.coords.altitude || 0;
const rockAltitude = parseFloat(feature?.properties?.altitude || '0');
const heightDifference = rockAltitude - userAltitude;

// Ángulo vertical basado en trigonometría real
const expectedVerticalAngle = Math.atan2(heightDifference, distance) * (180 / Math.PI);

// Proyección en perspectiva correcta (igual que horizontal)
const verticalAngleOnScreen = expectedVerticalAngle - (-pitch);
const verticalFovRad = (VERTICAL_FOV / 2) * Math.PI / 180;
const vertAngRad = verticalAngleOnScreen * Math.PI / 180;
const normY = Math.tan(vertAngClamped) / Math.tan(verticalFovRad);
const screenY = HEIGHT_SCREEN / 2 - (normY * HEIGHT_SCREEN) / 2;
```

**Resultado:** Las etiquetas aparecen en su posición vertical REAL basada en la elevación.

---

### 2️⃣ **Suavizado Mejorado y Zona Muerta**

#### Cambios en `camera_settings.ts`:
```typescript
// Reducción de factores de suavizado para más estabilidad
export const SMOOTHING_ALPHA_HEADING = .15;  // era .2
export const SMOOTHING_ALPHA_PITCH = .12;    // era .3

// Nueva constante: zona muerta
export const PITCH_DEADZONE = 0.5; // Ignora cambios < 0.5°
```

#### Lógica de zona muerta:
```typescript
useEffect(() => {
  setSmoothedPitch(prev => {
    const delta = rawPitch - prev;
    // Ignorar micro-movimientos
    if (Math.abs(delta) < PITCH_DEADZONE) {
      return prev; // No actualizar
    }
    return prev + SMOOTHING_ALPHA_PITCH * delta;
  });
}, [rawPitch]);
```

**Resultado:** Las etiquetas se mueven más suavemente y no tiemblan con pequeños movimientos.

---

### 3️⃣ **Sistema Anti-Colisión de Etiquetas**

#### Nueva función `adjustMarkersForCollision`:
```typescript
const adjustMarkersForCollision = (markers) => {
  const labelWidth = 120;
  const labelHeight = 40;
  const minSeparation = 10;

  // 3 iteraciones de separación
  for (let iter = 0; iter < 3; iter++) {
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        // Detectar overlap
        const overlapX = labelWidth + minSeparation - dx;
        const overlapY = labelHeight + minSeparation - dy;

        if (overlapX > 0 && overlapY > 0) {
          // Separar proporcionalmente
          // El rocher más cercano se mueve MENOS
          const ratioA = b.distance / totalDist;
          const ratioB = a.distance / totalDist;
          
          a.x -= separationX * ratioA;
          a.y -= separationY * ratioA;
          b.x += separationX * ratioB;
          b.y += separationY * ratioB;
        }
      }
    }
  }
};
```

**Algoritmo:**
1. Detecta etiquetas que se superponen
2. Calcula ángulo entre ellas
3. Las separa proporcionalmente a su distancia (las más cercanas tienen prioridad)
4. Repite 3 veces para resolver colisiones en cadena

**Resultado:** Las etiquetas cercanas se separan automáticamente, manteniéndose legibles.

---

### 4️⃣ **Tolerancia Vertical Basada en VERTICAL_FOV**

#### ❌ **Antes:**
```typescript
const verticalTolerance = 20; // Valor hardcoded arbitrario
```

#### ✅ **Ahora:**
```typescript
const verticalTolerance = VERTICAL_FOV / 2; // 35° / 2 = ±17.5°
```

**Resultado:** Coherencia con el campo de visión horizontal, más preciso.

---

## 🎨 Diagrama del Sistema

```
┌─────────────────────────────────────────┐
│   USUARIO (lat, lon, altitude)          │
│          ↓                               │
│   ┌─────────────────────────────┐       │
│   │ ROCHER (lat, lon, altitude) │       │
│   └─────────────────────────────┘       │
│          ↓                               │
│   Cálculo de distancia & bearing        │
│          ↓                               │
│   ┌──────────────────────────────┐      │
│   │ PROYECCIÓN HORIZONTAL (X):   │      │
│   │ tan(angleDiff) / tan(FOV/2)  │      │
│   └──────────────────────────────┘      │
│          ↓                               │
│   ┌──────────────────────────────┐      │
│   │ PROYECCIÓN VERTICAL (Y):     │      │
│   │ heightDiff = rockAlt-userAlt │      │
│   │ angle = atan2(height, dist)  │      │
│   │ tan(angle-pitch)/tan(VFOV/2) │      │
│   └──────────────────────────────┘      │
│          ↓                               │
│   ┌──────────────────────────────┐      │
│   │ SUAVIZADO:                   │      │
│   │ - Heading: alpha=0.15        │      │
│   │ - Pitch: alpha=0.12          │      │
│   │ - Deadzone: ±0.5°            │      │
│   └──────────────────────────────┘      │
│          ↓                               │
│   ┌──────────────────────────────┐      │
│   │ ANTI-COLISIÓN:               │      │
│   │ - Detectar overlap           │      │
│   │ - Separar proporcionalmente  │      │
│   │ - 3 iteraciones              │      │
│   └──────────────────────────────┘      │
│          ↓                               │
│   RENDERIZADO EN PANTALLA                │
└─────────────────────────────────────────┘
```

---

## 📊 Parámetros Ajustables

Si necesitas afinar el comportamiento:

### Suavizado (en `camera_settings.ts`):
- `SMOOTHING_ALPHA_HEADING`: 0.1 (muy estable) - 0.3 (muy reactivo)
- `SMOOTHING_ALPHA_PITCH`: 0.08 (muy estable) - 0.2 (muy reactivo)
- `PITCH_DEADZONE`: 0.3° (más estable) - 1.0° (ignora más movimiento)

### Anti-Colisión (en `camera.tsx`):
- `labelWidth`: Ajustar según tamaño real de tus etiquetas
- `labelHeight`: Ajustar según altura de etiquetas
- `minSeparation`: Espacio mínimo entre etiquetas (5-20 px)
- Iteraciones: Aumentar a 4-5 para mejor separación (más costo CPU)

### Campo de Visión:
- `HORIZONTAL_FOV`: 45-60° (ángulo de cámara)
- `VERTICAL_FOV`: 30-40° (ventana vertical)

---

## 🧪 Pruebas Recomendadas

1. **Rochers a diferentes altitudes:**
   - Verificar que los altos aparezcan arriba
   - Verificar que los bajos aparezcan abajo

2. **Movimiento suave:**
   - Mover el teléfono lentamente
   - No deberían temblar las etiquetas

3. **Múltiples etiquetas cercanas:**
   - Verificar que se separen automáticamente
   - No deberían superponerse

4. **Rochers lejanos vs cercanos:**
   - Los cercanos deben tener prioridad en colisiones
   - Los lejanos deben moverse más en caso de overlap

---

## 🐛 Troubleshooting

### "Las etiquetas están todas en el horizonte"
- Verificar que `location.coords.altitude` tenga valor
- Verificar que los rochers tengan `properties.altitude`

### "Las etiquetas se mueven muy rápido"
- Reducir `SMOOTHING_ALPHA_PITCH` y `SMOOTHING_ALPHA_HEADING`
- Aumentar `PITCH_DEADZONE`

### "Las etiquetas aún se superponen"
- Aumentar iteraciones en el loop anti-colisión (de 3 a 5)
- Aumentar `minSeparation`
- Ajustar `labelWidth` y `labelHeight` según tu UI

### "No veo ninguna etiqueta"
- Aumentar `VERTICAL_FOV` (prueba 45-50°)
- Verificar que el pitch del teléfono esté cerca del ángulo esperado
- Revisar que `MAX_DISTANCE` sea suficiente

---

## 📝 Notas Técnicas

1. **Altitud del usuario:** Se obtiene de `location.coords.altitude` (GPS)
2. **Precisión vertical:** Depende de la calidad del GPS (±5-10m típicamente)
3. **Performance:** El anti-colisión tiene complejidad O(n²) por iteración
   - Para muchas etiquetas (>50), considera optimizar con quadtree
4. **Compatibilidad:** Funciona en iOS y Android con expo-location

---

## ✅ Checklist de Verificación

- [x] Proyección vertical usa altitud real
- [x] Campo de visión vertical usa `VERTICAL_FOV`
- [x] Suavizado de pitch con zona muerta
- [x] Sistema anti-colisión implementado
- [x] Sin errores de TypeScript
- [x] Constantes configurables externalizadas

---

## 🚀 Próximas Mejoras Sugeridas

1. **Clustering:** Agrupar etiquetas muy cercanas en un solo marcador
2. **Nivel de detalle:** Mostrar más/menos info según distancia
3. **Orientación del texto:** Rotar etiquetas según bearing
4. **Fadeout progresivo:** Transparencia basada en ángulo de visión
5. **Caché de posiciones:** Memorizar posiciones ajustadas para reducir CPU

---

_Documento creado: 1 de diciembre, 2025_
