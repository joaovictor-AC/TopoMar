# 🔍 Modo Debug - Camera AR

## Logs Agregados

Los siguientes console.log() se han agregado para diagnosticar por qué no aparecen etiquetas:

### 1. Al inicio del useMemo:
```
📍 Location: lat, lon
📐 Heading: X° Pitch: Y°
🌊 Sea Level: X Delta: Y
```

### 2. Para cada roca procesada:
```
🪨 NombreRoca: dist=Xm, bearing=X°, alt=Xm, visible=true/false
  ⏭️ emergida - skip (si está fuera del agua)
  ⏭️ distance filter: Xm (range: 50-5000) (si está muy cerca/lejos)
  ⏭️ H-FOV filter: diff=X° (max=X°) (si está fuera del campo horizontal)
  ⏭️ V-FOV filter: pitchDiff=X° (max=X°) (si está fuera del campo vertical)
  ✅ PASSED all filters - will render (si pasa todos los filtros)
```

### 3. Al final:
```
✅ X markers passed all filters
```

---

## 🧪 Cómo Diagnosticar

### Caso 1: "No location available"
**Problema:** GPS no está funcionando
**Solución:** 
- Verificar permisos de ubicación
- Probar en dispositivo real (no emulador)
- Esperar señal GPS

### Caso 2: Todas las rocas dicen "emergida - skip"
**Problema:** El nivel del mar está muy bajo, todas las rocas están fuera del agua
**Solución:** 
- Ir a la pestaña "Water Level" 
- Aumentar el nivel del mar (sea level + delta)
- O temporalmente comentar la línea:
  ```typescript
  if (isVisibleByHeight) {
    console.log(`  ⏭️ ${name} emergida - skip`);
    return; // ← COMENTAR ESTA LÍNEA
  }
  ```

### Caso 3: "distance filter"
**Problema:** Las rocas están muy lejos o muy cerca
**Solución:** Ajustar en `camera_settings.ts`:
```typescript
export const MIN_DISTANCE = 50;    // Reducir a 10 o 0
export const MAX_DISTANCE = 5000;  // Aumentar a 10000
```

### Caso 4: "H-FOV filter"
**Problema:** No estás apuntando hacia las rocas
**Solución:** 
- Rotar el teléfono 360° lentamente
- O aumentar HORIZONTAL_FOV en `camera_settings.ts`:
  ```typescript
  export const HORIZONTAL_FOV = 120; // Campo muy amplio para testing
  ```

### Caso 5: "V-FOV filter"
**Problema:** El pitch del teléfono no apunta a las rocas
**Esto es el problema más probable con los cambios nuevos**

**Diagnóstico:**
Busca en los logs algo como:
```
⏭️ V-FOV filter: pitchDiff=45.2° (max=17.5°), expectedAngle=2.3°, pitch=-10.5°
```

Si `pitchDiff` es mucho mayor que `max`, el filtro vertical es demasiado estricto.

**Soluciones:**

#### Opción A: Aumentar VERTICAL_FOV (temporal para testing)
```typescript
// En camera_settings.ts
export const VERTICAL_FOV = 90; // Muy amplio para testing
```

#### Opción B: Desactivar filtro vertical temporalmente
```typescript
// En camera.tsx, línea ~245
const isVertOK = true; // TEMPORAL: siempre true
// const isVertOK = pitchDifference < verticalTolerance; // Comentar
```

#### Opción C: Verificar cálculo de altitud
El problema puede ser que `location.coords.altitude` no esté disponible:
```typescript
const userAltitude = location.coords.altitude || 0;
console.log('🧍 User altitude:', userAltitude); // Ver qué valor tiene
```

Si siempre es `0`, el GPS no proporciona altitud y el cálculo del ángulo vertical falla.

---

## 🚑 Modo "Ver TODO" (Emergencia)

Si quieres ver TODAS las rocas sin ningún filtro para confirmar que el render funciona:

```typescript
// En camera.tsx, dentro del forEach, COMENTAR todos los returns:

// if (isVisibleByHeight) return; // ← COMENTAR
// if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) return; // ← COMENTAR
// if (!isHorizVisible) return; // ← COMENTAR
// if (!isVertOK) return; // ← COMENTAR

// Dejar solo los logs activos
```

Esto mostrará TODAS las rocas del dataset, sin importar dónde apuntes.

---

## 📊 Parámetros Recomendados para Testing

Para ver etiquetas más fácilmente durante debugging:

```typescript
// camera_settings.ts
export const HORIZONTAL_FOV = 90;    // Muy amplio
export const VERTICAL_FOV = 90;      // Muy amplio
export const MIN_DISTANCE = 0;       // Sin mínimo
export const MAX_DISTANCE = 10000;   // 10km
```

Una vez que veas etiquetas, reducir gradualmente hasta encontrar valores óptimos.

---

## ✅ Checklist de Verificación

1. [ ] Abre Metro Bundler console (donde ejecutaste `npx expo start`)
2. [ ] Logs aparecen con "📍 Location"?
3. [ ] Logs muestran rocas procesadas "🪨"?
4. [ ] Alguna roca dice "✅ PASSED"?
5. [ ] Log final dice "✅ X markers"? ¿Cuántos?
6. [ ] Las etiquetas aparecen en pantalla?

Si llegas hasta el paso 5 con X > 0 pero no ves etiquetas en paso 6, el problema es de renderizado, no de filtros.

---

## 🔧 Siguiente Paso

**Ejecuta la app, mira los logs, y comparte:**
1. ¿Qué dice "📍 Location"?
2. ¿Cuántas rocas procesan "🪨"?
3. ¿En qué filtro se quedan la mayoría?
4. ¿Cuántas dicen "✅ PASSED"?
5. ¿El log final dice "✅ X markers"? ¿Qué valor de X?

Con esa info sabré exactamente qué ajustar.
