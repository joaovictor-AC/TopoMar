# TopoMar Components

Reusable component system based on Figma design.

## 📦 Available Components

### Button
Customizable button with multiple variants and sizes.

**Props:**
- `title` (string) - Button text
- `onPress` (function) - Function when pressed
- `variant` ('primary' | 'secondary' | 'outline' | 'text') - Visual style
- `size` ('sm' | 'md' | 'lg') - Button size
- `disabled` (boolean) - Disable button
- `loading` (boolean) - Show loading indicator
- `fullWidth` (boolean) - Take full width
- `style` (ViewStyle) - Custom styles
- `textStyle` (TextStyle) - Text styles

**Example:**
```tsx
import { Button } from '@/components';

<Button
  title="Accept"
  onPress={() => console.log('Pressed')}
  variant="primary"
  size="lg"
  fullWidth
/>
```

### Card
Container with elevation and shadow.

**Props:**
- `children` (ReactNode) - Card content
- `style` (ViewStyle) - Custom styles
- `elevation` ('sm' | 'md' | 'lg' | 'xl') - Shadow level
- `padding` (keyof spacing) - Internal padding

**Example:**
```tsx
import { Card } from '@/components';

<Card elevation="lg" padding="xl">
  <Text>Card content</Text>
</Card>
```

### Input
Text input field with validation.

**Props:**
- All `TextInput` props from React Native
- `label` (string) - Field label
- `error` (string) - Error message
- `helperText` (string) - Help text
- `containerStyle` (ViewStyle) - Container styles

**Example:**
```tsx
import { Input } from '@/components';

<Input
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>
```

## 🎨 Theme System

All components use the centralized theme system:

```tsx
import { theme } from '@/style/theme';

// Colors
theme.colors.primary.main
theme.colors.text.secondary

// Typography
theme.typography.fontSize.md
theme.typography.fontWeight.bold

// Spacing
theme.spacing.lg

// Borders
theme.borderRadius.md

// Shadows
theme.shadows.lg
```

## 🚀 How to Add New Components

### 1. Design in Figma
- Use components and variants
- Define reusable styles
- Apply Auto Layout

### 2. Export to VS Code
With Figma extension:
```
Ctrl+Shift+P → Figma: Copy as React Native
```

### 3. Create the Component
```bash
src/components/
  └── YourComponent/
      └── YourComponent.tsx
```

### 4. Base Structure
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/style/theme';

interface YourComponentProps {
  // Define your props
}

export const YourComponent: React.FC<YourComponentProps> = (props) => {
  return (
    <View style={styles.container}>
      {/* Your content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Use theme tokens
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
  },
});
```

### 5. Export the Component
In `src/components/index.ts`:
```tsx
export { YourComponent } from './YourComponent/YourComponent';
```

### 6. Use the Component
```tsx
import { YourComponent } from '@/components';

<YourComponent />
```

## 📝 Naming Conventions

### Files
- PascalCase for components: `Button.tsx`, `Card.tsx`
- camelCase for utilities: `theme.ts`, `helpers.ts`

### Props
- camelCase: `onPress`, `backgroundColor`
- Booleans with prefix: `isLoading`, `hasError`

### Styles
- camelCase: `container`, `buttonPrimary`
- Descriptive: `headerText`, `inputError`

## 🎯 Best Practices

### 1. Use TypeScript
Define interfaces for all props:
```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}
```

### 2. Use the Theme
Never hardcode values:
```tsx
// ❌ Bad
color: '#0a84ff'

// ✅ Good
color: theme.colors.primary.main
```

### 3. Controlled Components
For inputs, use external state:
```tsx
const [value, setValue] = useState('');

<Input value={value} onChangeText={setValue} />
```

### 4. Accessibility
Add accessibility props:
```tsx
<Button
  title="Submit"
  accessibilityLabel="Submit form"
  accessibilityHint="Press to submit the form"
/>
```

### 5. Documentation
Comment complex components:
```tsx
/**
 * Button Component
 * 
 * Reusable button with multiple variants
 * 
 * @example
 * <Button title="Click" onPress={() => {}} variant="primary" />
 */
```

## 🔧 Testing

### Basic test
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

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Figma for Developers](https://www.figma.com/developers)
- [Design Systems](https://www.designsystems.com/)
