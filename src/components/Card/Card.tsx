/**
 * Card Component - Componente reutilizable basado en diseño Figma
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../../style/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'md',
  padding = 'md',
}) => {
  return (
    <View
      style={[
        styles.card,
        theme.shadows[elevation],
        { padding: theme.spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
  },
});
