import { CameraView } from 'expo-camera';
import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { useDeviceOrientation } from '../../../hooks/useDeviceOrientation';
import { useLocation } from '../../../hooks/useLocation';
import { getBearing, getDistance } from '../../../utils/geolocation';
import { styles } from './styles';

import geoJsonData from '../../../../assets/geodata/IMT_EntitesRemarquables.json';

const HORIZONTAL_FOV = 80; // Lembre-se de calibrar este valor!
const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen() {
  const { location, errorMsg } = useLocation();
  const deviceHeading = useDeviceOrientation();

  const arMarkers = useMemo(() => {
    if (!location || !location.coords) {
      return [];
    }

    return geoJsonData.features
      .map((feature: any) => {
        const coords = feature.geometry.coordinates;
        if (
          !Array.isArray(coords) ||
          coords.length < 2 ||
          typeof coords[0] !== 'number' ||
          typeof coords[1] !== 'number'
        ) {
          return null;
        }

        const targetCoords = {
          lat2: coords[1],
          lon2: coords[0],
        };

        const userCoords = {
          lat1: location.coords.latitude,
          lon1: location.coords.longitude,
        };

        const distance = getDistance({ ...userCoords, ...targetCoords });

        const targetBearing = getBearing({ ...userCoords, ...targetCoords });
        let angleDifference = targetBearing - deviceHeading;

        if (angleDifference > 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        const isVisible = Math.abs(angleDifference) < HORIZONTAL_FOV / 2;
        if (!isVisible) return null;

        const screenX =
          screenWidth / 2 + (angleDifference / (HORIZONTAL_FOV / 2)) * (screenWidth / 2);

        const dynamicStyle = {
          transform: [
            { translateX: -feature.properties.nom.length * 4 }, 
            { scale: Math.max(0.4, 1.2 - distance / 2000) },
          ],
          opacity: Math.max(0.6, 1 - distance / 4000),
        };

        const distanceText =
          distance < 1000
            ? `${distance.toFixed(0)} m`
            : `${(distance / 1000).toFixed(1)} km`;

        return (
          <View
            key={feature.properties.nom}
            style={[styles.marker, { left: screenX, top: '50%' }, dynamicStyle]}
          >
            <Text style={styles.markerText}>{feature.properties.nom}</Text>
            <Text style={styles.markerDistanceText}>{distanceText}</Text>
          </View>
        );
      })
      .filter(Boolean);
  }, [location, deviceHeading]);

  return (
    <View style={styles.container}>
      <CameraView style={styles.container} facing="back" />
      {arMarkers}
      <View style={styles.overlay}>
        {location ? (
          <Text style={styles.overlayText}>
            Heading: {deviceHeading.toFixed(2)}°
          </Text>
        ) : (
          <Text style={styles.overlayText}>
            {errorMsg || 'Aguardando localização...'}
          </Text>
        )}
      </View>
    </View>
  );
}