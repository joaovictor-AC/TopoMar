/**
 * Ejemplo de Integración con Figma
 * Este archivo muestra cómo usar los componentes exportados desde Figma
 */

import { Button, Card, Input } from '@/components';
import { theme } from '@/style/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FigmaExampleScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !email) {
      setError('Por favor completa todos los campos');
      return;
    }
    console.log('Formulario enviado:', { name, email });
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Sección de Header */}
        <Card style={styles.headerCard} elevation="xl">
          <Text style={styles.mainTitle}>Ejemplo de Integración</Text>
          <Text style={styles.subtitle}>
            Componentes exportados desde Figma
          </Text>
        </Card>

        {/* Sección de Botones */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Variantes de Botones</Text>
          
          <Button
            title="Botón Primario"
            onPress={() => console.log('Primary')}
            variant="primary"
            size="lg"
            fullWidth
          />

          <Button
            title="Botón Secundario"
            onPress={() => console.log('Secondary')}
            variant="secondary"
            size="md"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Botón con Borde"
            onPress={() => console.log('Outline')}
            variant="outline"
            size="md"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Botón Texto"
            onPress={() => console.log('Text')}
            variant="text"
            size="sm"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Botón Deshabilitado"
            onPress={() => {}}
            variant="primary"
            size="md"
            fullWidth
            disabled
            style={styles.buttonSpacing}
          />

          <Button
            title="Cargando..."
            onPress={() => {}}
            variant="primary"
            size="md"
            fullWidth
            loading
            style={styles.buttonSpacing}
          />
        </Card>

        {/* Sección de Formulario */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Formulario de Ejemplo</Text>
          
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            value={name}
            onChangeText={setName}
            helperText="Requerido"
          />

          <Input
            label="Email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            title="Enviar"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Card>

        {/* Sección de Cards */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Elevaciones de Cards</Text>
          
          <Card elevation="sm" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card con sombra pequeña (sm)</Text>
          </Card>

          <Card elevation="md" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card con sombra media (md)</Text>
          </Card>

          <Card elevation="lg" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card con sombra grande (lg)</Text>
          </Card>

          <Card elevation="xl" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card con sombra extra grande (xl)</Text>
          </Card>
        </Card>

        {/* Sección de Colores del Theme */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Colores del Theme</Text>
          
          <View style={styles.colorGrid}>
            <View style={[styles.colorBox, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={styles.colorText}>Primary</Text>
            </View>
            
            <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary.main }]}>
              <Text style={styles.colorText}>Secondary</Text>
            </View>
            
            <View style={[styles.colorBox, { backgroundColor: theme.colors.error.main }]}>
              <Text style={styles.colorText}>Error</Text>
            </View>
            
            <View style={[styles.colorBox, { backgroundColor: theme.colors.warning.main }]}>
              <Text style={styles.colorText}>Warning</Text>
            </View>
            
            <View style={[styles.colorBox, { backgroundColor: theme.colors.success.main }]}>
              <Text style={styles.colorText}>Success</Text>
            </View>
            
            <View style={[styles.colorBox, { backgroundColor: theme.colors.info.main }]}>
              <Text style={styles.colorText}>Info</Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: theme.spacing.lg,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mainTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  buttonSpacing: {
    marginTop: theme.spacing.md,
  },
  nestedCard: {
    marginBottom: theme.spacing.md,
  },
  cardText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  colorBox: {
    width: 100,
    height: 80,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  colorText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.sm,
  },
});
