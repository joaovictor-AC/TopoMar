import { CameraView } from 'expo-camera';
import React, { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import geoJsonData from '../../../../assets/geodata/IMT_EntitesRemarquables.json';
import { useDeviceOrientation } from '../../../hooks/useDeviceOrientation';
import { useLocation } from '../../../hooks/useLocation';
import { getBearing, getDistance } from '../../../utils/geolocation';
import { styles } from './styles';

const HORIZONTAL_FOV = 80; // Champ de vision horizontal de la caméra (à ajuster)
const { width: screenWidth } = Dimensions.get('window');

export default function CameraScreen() {
  // 🔹 Orientation du téléphone
  const { pitch, yaw } = useDeviceOrientation();

  // 🔹 Localisation GPS
  const { location, errorMsg } = useLocation();

  // 🔹 Calcul des marqueurs visibles selon la direction du téléphone
  const arMarkers = useMemo(() => {
    if (!location?.coords) return [];

    return geoJsonData.features
      .map((feature: any) => {
        const coords = feature.geometry.coordinates;
        if (!Array.isArray(coords) || coords.length < 2) return null;

        // Coordonnées de l'utilisateur et du rocher
        const targetCoords = { lat2: coords[1], lon2: coords[0] };
        const userCoords = {
          lat1: location.coords.latitude,
          lon1: location.coords.longitude,
        };

        // 🔹 Calcul de la distance et de la direction du rocher
        const distance = getDistance({ ...userCoords, ...targetCoords });
        const targetBearing = getBearing({ ...userCoords, ...targetCoords });
        

        // 🔹 Filtrer : n'afficher que les rochers à moins de 2 km
        //if (distance > 2000) return null;

        // 🔹 Calcul de la différence d’angle entre la direction du téléphone et le rocher
        let angleDifference = targetBearing - yaw;
        if (angleDifference > 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        // 🔹 Si hors du champ de vision horizontal, on ne l’affiche pas
        const isVisible = Math.abs(angleDifference) < HORIZONTAL_FOV / 2;
        if (!isVisible) return null;

        // 🔹 Position horizontale à l’écran
        const screenX =
          screenWidth / 2 +
          (angleDifference / (HORIZONTAL_FOV / 2)) * (screenWidth / 2);

        // 🔹 Position verticale : plus le rocher est loin, plus il est haut
        const baseY = 500; // position moyenne (ajuste selon la hauteur de ton écran)
        const maxOffset = 400; // décalage max
        const screenY = baseY - Math.min(distance / 5, maxOffset);

        // 🔹 Style dynamique (taille et opacité)
        const dynamicStyle = {
          transform: [
            { translateX: -feature.properties.nom.length * 4 },
            { scale: Math.max(0.4, 1.2 - distance / 2000) },
          ],
          opacity: Math.max(0.6, 1 - distance / 4000),
        };

        // 🔹 Distance affichée (m ou km)
        const distanceText =
          distance < 1000
            ? `${distance.toFixed(0)} m`
            : `${(distance / 1000).toFixed(1)} km`;

        // 🔹 Rendu du marqueur à l’écran
        return (
          <View
            key={feature.properties.nom}
            style={[styles.marker, { left: screenX, top: screenY }, dynamicStyle]}
          >
            <Text style={styles.markerText}>{feature.properties.nom}</Text>
            <Text style={styles.markerDistanceText}>{distanceText}</Text>
          </View>
        );
      })
      .filter(Boolean);
  }, [location, yaw]);

  // 🔹 Rendu final de la caméra + superposition AR
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