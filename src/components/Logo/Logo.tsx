/**
 * Logo Component
 * Reusable component to display the TopoMar logo
 */

import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

// Your custom logo
const logoDefault = require('../../../assets/images/logo.png');

// If you later add a white version, uncomment:
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
  // Use your default logo, or a custom one if passed via props
  const logoSource = source || logoDefault;
  
  // If you add logo-white.png, you can enable this:
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
