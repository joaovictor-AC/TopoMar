/**
 * Logo Component
 * Componente reutilizable para mostrar el logo de TopoMar
 */

import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

// Tu logo personalizado
const logoDefault = require('../../../assets/images/logo.png');

// Si más adelante añades una versión en blanco, descomenta:
// const logoWhite = require('../../../assets/images/logo-white.png');

interface LogoProps {
  size?: number;
  variant?: 'default' | 'white';
  style?: StyleProp<ImageStyle>;
  source?: ImageSourcePropType;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 100, 
  variant = 'default',
  style,
  source
}) => {
  // Usa tu logo por defecto, o uno personalizado si se pasa por props
  const logoSource = source || logoDefault;
  
  // Si añades logo-white.png, puedes habilitar esto:
  // const logoSource = source || (variant === 'white' ? logoWhite : logoDefault);

  return (
    <Image 
      source={logoSource}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
};

export default Logo;
