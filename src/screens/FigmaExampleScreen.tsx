/**
 * Figma Integration Example
 * This file shows how to use components exported from Figma
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
      setError('Please complete all fields');
      return;
    }
    console.log('Form submitted:', { name, email });
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <Card style={styles.headerCard} elevation="xl">
          <Text style={styles.mainTitle}>Integration Example</Text>
          <Text style={styles.subtitle}>
            Components exported from Figma
          </Text>
        </Card>

        {/* Buttons Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Button Variants</Text>
          
          <Button
            title="Primary Button"
            onPress={() => console.log('Primary')}
            variant="primary"
            size="lg"
            fullWidth
          />

          <Button
            title="Secondary Button"
            onPress={() => console.log('Secondary')}
            variant="secondary"
            size="md"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Outline Button"
            onPress={() => console.log('Outline')}
            variant="outline"
            size="md"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Text Button"
            onPress={() => console.log('Text')}
            variant="text"
            size="sm"
            fullWidth
            style={styles.buttonSpacing}
          />

          <Button
            title="Disabled Button"
            onPress={() => {}}
            variant="primary"
            size="md"
            fullWidth
            disabled
            style={styles.buttonSpacing}
          />

          <Button
            title="Loading..."
            onPress={() => {}}
            variant="primary"
            size="md"
            fullWidth
            loading
            style={styles.buttonSpacing}
          />
        </Card>

        {/* Form Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Example Form</Text>
          
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            helperText="Required"
          />

          <Input
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            title="Submit"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Card>

        {/* Cards Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Card Elevations</Text>
          
          <Card elevation="sm" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card with small shadow (sm)</Text>
          </Card>

          <Card elevation="md" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card with medium shadow (md)</Text>
          </Card>

          <Card elevation="lg" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card with large shadow (lg)</Text>
          </Card>

          <Card elevation="xl" style={styles.nestedCard}>
            <Text style={styles.cardText}>Card with extra large shadow (xl)</Text>
          </Card>
        </Card>

        {/* Theme Colors Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Colors</Text>
          
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
