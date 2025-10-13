import { CameraView } from 'expo-camera';
import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import geoJsonData from '../../../../assets/geodata/KERLOUAN_ILOTS_1310.json';
import { useDeviceOrientation } from '../../../hooks/useDeviceOrientation';
import { useLocation } from '../../../hooks/useLocation';
import { getBearing, getDistance } from '../../../utils/geolocation';
import { styles } from './styles';

const HORIZONTAL_FOV = 80; // Champ de vision horizontal de la caméra (à ajuster)
const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen() {
  // 🔹 On récupère la position du téléphone
  const { pitch, yaw } = useDeviceOrientation();

  // 🔹 On récupère la localisation GPS
  const { location, errorMsg } = useLocation();

  // 🔹 Calcul des marqueurs visibles selon la direction du téléphone
  const arMarkers = useMemo(() => {
    if (!location?.coords) return [];

    return geoJsonData.features
      .map((feature: any) => {
        const coords = feature.geometry.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) return null;

        const targetCoords = { lat2: coords[1], lon2: coords[0] };
        const userCoords = {
          lat1: location.coords.latitude,
          lon1: location.coords.longitude,
        };

        const distance = getDistance({ ...userCoords, ...targetCoords });
        const targetBearing = getBearing({ ...userCoords, ...targetCoords });

        // Différence entre la direction du téléphone (yaw) et la direction du point
        let angleDifference = targetBearing - yaw;
        if (angleDifference > 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        // Visible uniquement si dans le champ de vision
        const isVisible = Math.abs(angleDifference) < HORIZONTAL_FOV / 2;
        if (!isVisible) return null;

        const screenX =
          screenWidth / 2 +
          (angleDifference / (HORIZONTAL_FOV / 2)) * (screenWidth / 2);

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
  }, [location, yaw]);

  return (
    <View style={styles.container}>
      <CameraView style={styles.container} facing="back" />
      {arMarkers}
      <View style={styles.overlay}>
        {location ? (
          <>
            <Text style={styles.overlayText}>Pitch: {pitch.toFixed(1)}°</Text>
            <Text style={styles.overlayText}>Yaw: {yaw.toFixed(1)}°</Text>
          </>
        ) : (
          <Text style={styles.overlayText}>
            {errorMsg || 'Chargement de la localisation...'}
          </Text>
        )}
      </View>
    </View>
  );
}
