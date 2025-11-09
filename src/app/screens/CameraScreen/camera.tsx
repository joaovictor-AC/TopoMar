import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDeviceOrientation } from '../../../hooks/useDeviceOrientation';
import { useDevicePitch } from '../../../hooks/useDevicePitch';
import { useLocation } from '../../../hooks/useLocation';
import { getBearing, getDistance } from '../../../utils/geolocation';
import { styles } from './styles';


import geoJsonData from '../../../../assets/geodata/IMT_EntitesRemarquables.json';

const HORIZONTAL_FOV = 50;   // plus étroit (essaie 45–55)
const VERTICAL_FOV   = 35;   // “fenêtre” verticale (essaie 30–40)
const FOV_MARGIN     = 6;    // marge anti-bord pour éviter le clignotement
const HEADING_OFFSET = 0;    // ajuste à +/– quelques degrés si besoin
const { width: screenWidth } = Dimensions.get('window');
const MAX_DEPTH_METERS = 2000; // distance à partir de laquelle on considère "fond"


export default function CameraScreen() {
  const { location, errorMsg } = useLocation();
  const deviceHeading = useDeviceOrientation();
  const pitch = useDevicePitch?.() ?? 0; // si pas de hook, reste à 0
  // Lissage exponentiel de l’azimut pour calmer le bruit
  const [smoothedHeading, setSmoothedHeading] = useState(deviceHeading);
  useEffect(() => {
    const alpha = 0.2; // 0..1 (plus petit = plus lisse)
    setSmoothedHeading(prev => {
      // lissage avec prise en compte du 0°/360°
      let delta = deviceHeading - prev;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      return (prev + alpha * delta + 360) % 360;
    });
  }, [deviceHeading]);

  // Appliquer un éventuel décalage fixe (calibration grossière)
  const heading = (smoothedHeading + HEADING_OFFSET + 360) % 360;

  const [permission, requestPermission] = useCameraPermissions(); // ADDED

  useEffect(() => {                                              // ADDED
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);                                              // ADDED
  
  const arMarkers = useMemo(() => {
  if (!location?.coords) return [];

  const items: Array<{ element: React.ReactElement; distance: number }> = [];

  geoJsonData.features.forEach((feature: any) => {
    const coords = feature.geometry.coordinates;
    if (
      !Array.isArray(coords) ||
      coords.length < 2 ||
      typeof coords[0] !== 'number' ||
      typeof coords[1] !== 'number'
    ) {
      return; // ← on sort de ce feature
    }

    const targetCoords = { lat2: coords[1], lon2: coords[0] };
    const userCoords   = { lat1: location.coords.latitude, lon1: location.coords.longitude };

    const distance      = getDistance({ ...userCoords, ...targetCoords });
    const targetBearing = getBearing({ ...userCoords, ...targetCoords });

    // --- visibilité H ---
    let angleDifference = targetBearing - heading; // heading = lissé + offset
    if (angleDifference > 180) angleDifference -= 360;
    if (angleDifference < -180) angleDifference += 360;

    const isHorizVisible = Math.abs(angleDifference) < (HORIZONTAL_FOV / 2 - FOV_MARGIN);
    if (!isHorizVisible) return;

    // --- visibilité V ---
    const isVertOK = (-pitch) > -10 && (-pitch) < +15; // ton test actuel
    if (!isVertOK) return;

    // (option) anti-sol dur
    // if (pitch <= -20) return;

    // --- projection X ---
    const screenX =
      screenWidth / 2 + (angleDifference / (HORIZONTAL_FOV / 2)) * (screenWidth / 2);
    const clampedX = Math.max(0, Math.min(screenWidth, screenX));

    // --- “perspective” selon la distance ---
    const depth   = Math.max(0, 1 - distance / MAX_DEPTH_METERS); // 1=près, 0=loin
    const zIndex  = 1000 + Math.round(depth * 1000);
    const scale   = 0.8 + 0.7 * depth;     // 0.8..1.5
    const opacity = 0.5 + 0.5 * depth;     // 0.5..1.0

    // (option) léger placement vertical
    const { height: screenHeight } = Dimensions.get('window');
    const topPx = screenHeight * (0.50 - 0.05 * (1 - depth)); // ajuste le 0.05 si tu veux

    const distanceText =
      distance < 1000 ? `${distance.toFixed(0)} m` : `${(distance / 1000).toFixed(1)} km`;

    const element = (
      <View
        key={feature.properties.nom}
        pointerEvents="none"
        style={[
          styles.marker,                          // doit avoir position:'absolute'
          { left: clampedX, top: topPx, zIndex }, // zIndex ici
          {
            transform: [
              { translateX: -feature.properties.nom.length * 4 },
              { scale }
            ],
            opacity
          }
        ]}
      >
        <Text style={styles.markerText}>{feature.properties.nom}</Text>
        <Text style={styles.markerDistanceText}>{distanceText}</Text>
      </View>
    );

    // On empile dans la liste pour trier après
    items.push({ element, distance });
  });

  // Tri: plus proche → plus loin
  items.sort((a, b) => a.distance - b.distance);

  // On renvoie seulement les éléments
  return items.map(i => i.element);
}, [location, heading, pitch]);
  if (!permission) {
    return <View style={styles.container}><Text>Checking camera permission…</Text></View>; // ADDED
  }
  if (!permission.granted) {
    return <View style={styles.container}><Text>Camera permission is required</Text></View>; // ADDED
  }


  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" active={true} />
      {arMarkers}
      <View style={styles.overlay} pointerEvents="none">
        {location ? (
          <Text style={styles.overlayText}>
            Heading: {heading.toFixed(1)}°
          </Text>
        ) : (
          <Text style={styles.overlayText}>
            {errorMsg || 'Aguardando localização...'}
            Heading: {heading.toFixed(1)}°  |  Pitch: {pitch.toFixed(1)}°
          </Text>
        )}
      </View>
    </View>
  );
}