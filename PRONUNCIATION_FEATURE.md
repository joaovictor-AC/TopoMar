# 🔊 Funcionalidad de Pronunciación - Explicación Detallada

## 📋 ¿Qué hemos implementado?

Hemos añadido un **modal/banner interactivo** que aparece cuando tocas una etiqueta de roca en la cámara AR. Este modal te da dos opciones:
1. **🔊 Pronunciar**: Escuchar cómo se pronuncia el nombre de la roca
2. **📊 Ver Nivel del Mar**: Ir a la pantalla de nivel del mar (funcionalidad anterior)

---

## 🛠️ ¿Cómo funciona?

### Paso 1: Tocar una etiqueta
Cuando tocas una etiqueta en la pantalla de la cámara, **ya NO navega directamente** al nivel del mar. En su lugar:
- Se guarda la información de la roca seleccionada
- Se abre un modal bonito con las opciones

### Paso 2: El Modal
El modal muestra:
```
┌─────────────────────────────────┐
│     Pointe du Dellec           │  ← Nombre de la roca
├─────────────────────────────────┤
│  [🔊  Pronunciar]              │  ← Botón azul
│                                 │
│  [📊  Ver Nivel del Mar]       │  ← Botón azul
│                                 │
│        Cerrar                   │  ← Botón gris
└─────────────────────────────────┘
```

### Paso 3: Text-to-Speech (Pronunciación)
Cuando pulsas **"🔊 Pronunciar"**:

1. **Se usa `expo-speech`**: Una librería que convierte texto a voz
2. **Idioma francés (fr-FR)**: Perfecto para nombres bretones/franceses como:
   - "Pointe du Dellec"
   - "Basse de Portsall"
   - "Rocher de Guévendel"
3. **Configuración de voz**:
   - `pitch: 1.0` → Tono normal
   - `rate: 0.85` → Velocidad 85% (más lento para claridad)

**El dispositivo pronuncia el nombre en voz alta** 🔊

---

## 💻 Código Explicado

### 1. Imports Necesarios
```typescript
import * as Speech from "expo-speech";  // Para Text-to-Speech
import { Modal } from "react-native";   // Para el popup
import { useState } from "react";       // Para controlar estado del modal
```

### 2. Estados del Modal
```typescript
const [modalVisible, setModalVisible] = useState(false);  // ¿Está abierto el modal?
const [selectedRock, setSelectedRock] = useState<{       // ¿Qué roca se seleccionó?
    name: string;
    lat: number;
    lon: number;
} | null>(null);
```

### 3. Función de Pronunciación
```typescript
const pronounceRockName = async (name: string) => {
    await Speech.stop();              // Para cualquier voz anterior
    await Speech.speak(name, {
        language: 'fr-FR',            // Francés
        pitch: 1.0,                   // Tono normal
        rate: 0.85,                   // Velocidad 85%
    });
};
```

**¿Por qué francés?**
- Los nombres bretones están basados en francés
- La pronunciación francesa es más precisa que español o inglés
- Ejemplos: "Pointe" se pronuncia "puant", no "pointe"

### 4. Cambio en el TouchableOpacity
**Antes:**
```typescript
onPress={() => {
    router.push(...); // Navegaba directamente
}}
```

**Ahora:**
```typescript
onPress={() => {
    setSelectedRock({      // Guarda la roca
        name: feature.properties.nom,
        lat: coords[1],
        lon: coords[0],
    });
    setModalVisible(true); // Abre el modal
}}
```

### 5. El Modal JSX
```typescript
<Modal
    animationType="fade"              // Aparece con fade
    transparent={true}                // Fondo semitransparente
    visible={modalVisible}            // Control de visibilidad
>
    <TouchableOpacity                 // Cerrar al tocar fuera
        style={styles.modalOverlay}
        onPress={() => setModalVisible(false)}
    >
        <View style={styles.modalContent}>
            {/* Contenido del modal */}
        </View>
    </TouchableOpacity>
</Modal>
```

---

## 🎨 Diseño Visual

### Colores:
- **Fondo overlay**: Negro con 70% transparencia → `rgba(0, 0, 0, 0.7)`
- **Modal**: Blanco con sombras → `#ffffff`
- **Botones**: Azul Material Design → `#2196f3`
- **Texto cerrar**: Gris → `#666`

### Espaciado:
- **Padding modal**: 24px
- **Bordes redondeados**: 20px (modal), 12px (botones)
- **Margen entre botones**: 12px
- **Sombras**: Elevation 10 (modal), 3 (botones)

---

## 📱 Flujo de Usuario

```
1. Usuario ve la cámara AR
   ↓
2. Ve etiquetas de rocas flotando
   ↓
3. Toca una etiqueta (ej: "Pointe du Dellec")
   ↓
4. Aparece modal con el nombre y 2 opciones
   ↓
5a. Pulsa "Pronunciar"              5b. Pulsa "Ver Nivel del Mar"
    ↓                                    ↓
    El teléfono dice:                   Navega a la pantalla
    "puant du delek"                     de nivel del mar
                                         (como antes)
```

---

## ⚙️ Configuración Técnica

### Requisitos:
1. **Instalar expo-speech**:
   ```bash
   npx expo install expo-speech
   ```

2. **Permisos**: No se necesitan permisos especiales (el audio sale automáticamente)

3. **Funciona offline**: ✅ Sí (usa el TTS del sistema operativo)

4. **Idiomas disponibles**:
   - `fr-FR`: Francés (Francia) ← **El que usamos**
   - `es-ES`: Español (España)
   - `en-US`: Inglés (USA)
   - Y muchos más...

---

## 🔧 Posibles Mejoras Futuras

### 1. Añadir transcripción fonética (IPA)
```typescript
<Text style={styles.phoneticText}>
    /pwɛ̃t dy dɛlɛk/
</Text>
```

### 2. Cambiar velocidad de voz
```typescript
rate: 0.75  // Más lento
rate: 1.0   // Normal
rate: 1.25  // Más rápido
```

### 3. Selector de idioma
```typescript
const [language, setLanguage] = useState('fr-FR');
// Botones para cambiar entre fr-FR, es-ES, en-US
```

### 4. Botón de repetir
Añadir un botón "🔁 Repetir" para escuchar de nuevo sin cerrar el modal.

### 5. Archivos de audio personalizados
Si quieres pronunciación perfecta, puedes grabar archivos MP3:
```typescript
import { Audio } from 'expo-av';
const sound = new Audio.Sound();
await sound.loadAsync(require('./audio/pointe_du_dellec.mp3'));
await sound.playAsync();
```

---

## 🐛 Resolución de Problemas

### Problema: No se escucha nada
**Solución**: 
- Verifica que el volumen del teléfono no esté en silencio
- Verifica que `expo-speech` esté instalado
- Prueba con otro idioma: `language: 'en-US'`

### Problema: La pronunciación es incorrecta
**Solución**:
- Cambia el idioma: `language: 'es-ES'` o `language: 'en-GB'`
- Ajusta la velocidad: `rate: 0.7` (más lento ayuda)
- Considera usar archivos de audio pregrabados para nombres complicados

### Problema: El modal no aparece
**Solución**:
- Verifica que `modalVisible` se esté estableciendo a `true`
- Añade un `console.log` para debug:
  ```typescript
  onPress={() => {
      console.log('Rock tapped:', feature.properties.nom);
      setModalVisible(true);
  }}
  ```

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Tocar etiqueta** | Navega directamente | Abre modal con opciones |
| **Pronunciación** | ❌ No existe | ✅ Text-to-Speech |
| **Flexibilidad** | Solo una acción | Dos acciones + cerrar |
| **UX** | Simple | Más interactivo |
| **Aprendizaje** | No ayuda con nombres | Ayuda a aprender pronunciación |

---

## 🎓 ¿Qué has Aprendido?

1. **Text-to-Speech (TTS)**: Convertir texto a voz automáticamente
2. **Modales en React Native**: Crear popups elegantes
3. **Estados**: Controlar visibilidad y datos seleccionados
4. **Configuración de idiomas**: Adaptar la voz al contexto
5. **UX mejorada**: Dar más opciones al usuario sin complicar

---

## ✅ Resultado Final

Ahora tienes una app que:
- ✅ Muestra etiquetas AR en tiempo real
- ✅ Permite escuchar la pronunciación de nombres complejos
- ✅ Mantiene la funcionalidad de ver el nivel del mar
- ✅ Tiene una interfaz moderna y fácil de usar
- ✅ Ayuda a los usuarios a aprender los nombres correctos de las rocas

**¡Perfecto para turistas y navegantes que quieren aprender los nombres locales!** 🌊🗿
