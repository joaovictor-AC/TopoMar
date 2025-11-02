# Componentes TopoMar

Sistema de componentes reutilizables basados en diseño de Figma.

## 📦 Componentes Disponibles

### Button
Botón personalizable con múltiples variantes y tamaños.

**Props:**
- `title` (string) - Texto del botón
- `onPress` (function) - Función al presionar
- `variant` ('primary' | 'secondary' | 'outline' | 'text') - Estilo visual
- `size` ('sm' | 'md' | 'lg') - Tamaño del botón
- `disabled` (boolean) - Deshabilitar botón
- `loading` (boolean) - Mostrar indicador de carga
- `fullWidth` (boolean) - Ocupar todo el ancho
- `style` (ViewStyle) - Estilos personalizados
- `textStyle` (TextStyle) - Estilos del texto

**Ejemplo:**
```tsx
import { Button } from '@/components';

<Button
  title="Aceptar"
  onPress={() => console.log('Presionado')}
  variant="primary"
  size="lg"
  fullWidth
/>
```

### Card
Contenedor con elevación y sombra.

**Props:**
- `children` (ReactNode) - Contenido de la tarjeta
- `style` (ViewStyle) - Estilos personalizados
- `elevation` ('sm' | 'md' | 'lg' | 'xl') - Nivel de sombra
- `padding` (keyof spacing) - Espaciado interno

**Ejemplo:**
```tsx
import { Card } from '@/components';

<Card elevation="lg" padding="xl">
  <Text>Contenido de la tarjeta</Text>
</Card>
```

### Input
Campo de entrada de texto con validación.

**Props:**
- Todas las props de `TextInput` de React Native
- `label` (string) - Etiqueta del campo
- `error` (string) - Mensaje de error
- `helperText` (string) - Texto de ayuda
- `containerStyle` (ViewStyle) - Estilos del contenedor

**Ejemplo:**
```tsx
import { Input } from '@/components';

<Input
  label="Email"
  placeholder="correo@ejemplo.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>
```

## 🎨 Theme System

Todos los componentes usan el sistema de theme centralizado:

```tsx
import { theme } from '@/style/theme';

// Colores
theme.colors.primary.main
theme.colors.text.secondary

// Tipografía
theme.typography.fontSize.md
theme.typography.fontWeight.bold

// Espaciado
theme.spacing.lg

// Bordes
theme.borderRadius.md

// Sombras
theme.shadows.lg
```

## 🚀 Cómo Agregar Nuevos Componentes

### 1. Diseña en Figma
- Usa componentes y variantes
- Define estilos reutilizables
- Aplica Auto Layout

### 2. Exporta a VS Code
Con la extensión de Figma:
```
Ctrl+Shift+P → Figma: Copy as React Native
```

### 3. Crea el Componente
```bash
src/components/
  └── TuComponente/
      └── TuComponente.tsx
```

### 4. Estructura Base
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/style/theme';

interface TuComponenteProps {
  // Define tus props
}

export const TuComponente: React.FC<TuComponenteProps> = (props) => {
  return (
    <View style={styles.container}>
      {/* Tu contenido */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Usa tokens del theme
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
  },
});
```

### 5. Exporta el Componente
En `src/components/index.ts`:
```tsx
export { TuComponente } from './TuComponente/TuComponente';
```

### 6. Usa el Componente
```tsx
import { TuComponente } from '@/components';

<TuComponente />
```

## 📝 Convenciones de Nombrado

### Archivos
- PascalCase para componentes: `Button.tsx`, `Card.tsx`
- camelCase para utilidades: `theme.ts`, `helpers.ts`

### Props
- camelCase: `onPress`, `backgroundColor`
- Booleanos con prefijo: `isLoading`, `hasError`

### Estilos
- camelCase: `container`, `buttonPrimary`
- Descriptivos: `headerText`, `inputError`

## 🎯 Mejores Prácticas

### 1. Usa TypeScript
Define interfaces para todas las props:
```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}
```

### 2. Usa el Theme
Nunca hardcodees valores:
```tsx
// ❌ Malo
color: '#0a84ff'

// ✅ Bueno
color: theme.colors.primary.main
```

### 3. Componentes Controlados
Para inputs, usa estado externo:
```tsx
const [value, setValue] = useState('');

<Input value={value} onChangeText={setValue} />
```

### 4. Accesibilidad
Añade props de accesibilidad:
```tsx
<Button
  title="Enviar"
  accessibilityLabel="Enviar formulario"
  accessibilityHint="Presiona para enviar el formulario"
/>
```

### 5. Documentación
Comenta componentes complejos:
```tsx
/**
 * Button Component
 * 
 * Botón reutilizable con múltiples variantes
 * 
 * @example
 * <Button title="Click" onPress={() => {}} variant="primary" />
 */
```

## 🔧 Testing

### Test básico
```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

test('Button calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button title="Test" onPress={onPress} />
  );
  
  fireEvent.press(getByText('Test'));
  expect(onPress).toHaveBeenCalled();
});
```

## 📚 Recursos

- [Documentación de React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Figma for Developers](https://www.figma.com/developers)
- [Design Systems](https://www.designsystems.com/)
