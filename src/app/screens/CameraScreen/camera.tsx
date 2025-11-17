import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useDeviceOrientation } from '../../../hooks/useDeviceOrientation';
import { useDevicePitch } from '../../../hooks/useDevicePitch';
import { useLocation } from '../../../hooks/useLocation';
import { getBearing, getDistance } from '../../../utils/geolocation';
import { styles } from './styles';


import geoJsonData from '../../../../assets/geodata/IMT_EntitesRemarquables.json';

const HORIZONTAL_FOV = 50;   // plus étroit (essaie 45–55)
const VERTICAL_FOV   = 35;   // “fenêtre” verticale (essaie 30–40)
const FOV_MARGIN     = 3;    // marge anti-bord pour éviter le clignotement
const HEADING_OFFSET = 0;    // ajuste à +/– quelques degrés si besoin
const { width: screenWidth,  height: screenHeight } = Dimensions.get('window');
const MAX_DEPTH_METERS = 3000; // distance à partir de laquelle on considère "fond"
const HYSTERESIS_DEG = 3;   // marge de grâce quand on sort à peine du cône 
const VIS_STICK_MS = 600; //on conserve l'étiquette environ 0,8s après sortie du cône 
// Nouveaux paramètres pour améliorer la précision
const SMOOTHING_ALPHA_HEADING = 0.2;  // Lissage azimut (0.15->0.2 = plus réactif)
const SMOOTHING_ALPHA_PITCH = 0.3;    // Lissage pitch
const MIN_DISTANCE = 50;              // Distance minimale en mètres
const MAX_DISTANCE = 5000;            // Distance maximale en mètres



export default function CameraScreen() {
  const { location, errorMsg } = useLocation();
  const deviceHeading = useDeviceOrientation();
  const rawPitch = useDevicePitch?.() ?? 0; // si pas de hook, reste à 0
  // Lissage de l'azimut avec gestion du 0°/360°
  const [smoothedHeading, setSmoothedHeading] = useState(deviceHeading);
  const prevHeadingRef = useRef(deviceHeading);
  useEffect(() => {
    setSmoothedHeading(prev => {
      // lissage avec prise en compte du 0°/360°
      let delta = deviceHeading - prev;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      const newHeading = (prev + SMOOTHING_ALPHA_HEADING * delta + 360) % 360;
      prevHeadingRef.current = newHeading;
      return newHeading;
    });
  }, [deviceHeading]);

  // Lissage du pitch (ADDED)
  const [smoothedPitch, setSmoothedPitch] = useState(rawPitch);
  useEffect(() => {
    setSmoothedPitch(prev => 
      prev + SMOOTHING_ALPHA_PITCH * (rawPitch - prev)
    );
  }, [rawPitch]);

  // Appliquer un éventuel décalage fixe 
  const heading = (smoothedHeading + HEADING_OFFSET + 360) % 360;
  const pitch = smoothedPitch;

  const [permission, requestPermission] = useCameraPermissions(); // ADDED

  useEffect(() => {                                              // ADDED
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);                                              // ADDED

  //Mémorise le dernier instant où un POI a été visible
  const lastVisibleRef = useRef<Record<string, number>>({});
  
  // ==================== CALCUL DES MARQUEURS AR ====================
  const arMarkers = useMemo(() => {
  if (!location?.coords) return [];

  const items: Array<{ element: React.ReactElement; distance: number; bearing: number;}> = [];

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
    // Coordonnées de l'utilisateur et du rocher
    const targetCoords = { lat2: coords[1], lon2: coords[0] };
    const userCoords   = { lat1: location.coords.latitude, lon1: location.coords.longitude };

    //Calcul de la distance et de la direction du rocher 
    const distance      = getDistance({ ...userCoords, ...targetCoords });
    const targetBearing = getBearing({ ...userCoords, ...targetCoords });

    // Filtrer par distance
    if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) return;

    // --- visibilité H ---
    let angleDifference = targetBearing - heading; // heading = lissé + offset
    if (angleDifference > 180) angleDifference -= 360;
    if (angleDifference < -180) angleDifference += 360;

    // Si hors du champs visuel, étiquette n'apparaît pas 
    const now = Date.now();
    const halfFov = HORIZONTAL_FOV / 2;

    // test strict
    const inConeStrict = Math.abs(angleDifference) < (halfFov - FOV_MARGIN);

    // test “presque dedans” (grâce/hystérésis)
    const inConeNear = Math.abs(angleDifference) < (halfFov - FOV_MARGIN + HYSTERESIS_DEG);

    const name = feature.properties.nom || 'Inconnu';
    const lastTs = lastVisibleRef.current[name] ?? 0;

    // garder si strictement dedans OU si presque dedans ET qu’on l’a vu récemment
    const isHorizVisible =
      inConeStrict || (inConeNear && now - lastTs < VIS_STICK_MS);

    if (!isHorizVisible) return;

    // si visible, on met à jour le timestamp (sert à la “grâce”)
    lastVisibleRef.current[name] = now;

    // ==================== VISIBILITÉ VERTICALE AMÉLIORÉE ====================
    // Calcul de l'angle vertical attendu basé sur la distance
    // Plus le rocher est loin, plus il devrait apparaître vers l'horizon
    const expectedVerticalAngle = Math.atan2(0, distance) * (180 / Math.PI); // ≈0° pour horizon
    const verticalTolerance = 20; // ±20° de tolérance
      
    const pitchDifference = Math.abs(-pitch - expectedVerticalAngle);
    const isVertOK = pitchDifference < verticalTolerance;
      
    if (!isVertOK) return;

    // ==================== PROJECTION HORIZONTALE (X) ====================
    const halfFovRad = (HORIZONTAL_FOV / 2) * Math.PI / 180;
    const angRad = angleDifference * Math.PI / 180;

    // Limite de sécurité pour éviter tan() → ∞
    const EPS_DEG = 1;
    const maxAngRad = ((HORIZONTAL_FOV / 2 - EPS_DEG) * Math.PI) / 180;
    const angRadClamped = Math.max(-maxAngRad, Math.min(maxAngRad, angRad));

    // Projection en perspective
    const normX = Math.tan(angRadClamped) / Math.tan(halfFovRad);
    const screenX = screenWidth / 2 + (normX * screenWidth) / 2;
    const clampedX = Math.max(20, Math.min(screenWidth - 20, screenX));

    // ==================== PROJECTION VERTICALE (Y) AMÉLIORÉE ====================
    // Position Y basée sur:
    // 1. Distance (plus loin = plus haut vers horizon)
    // 2. Pitch du téléphone (compensation)
      
    const distanceFactor = Math.min(distance / MAX_DEPTH_METERS, 1);
      
    // Position de base au centre de l'écran
    const centerY = screenHeight * 0.5;
      
    // Décalage basé sur la distance (loin = monte vers horizon)
    const distanceOffset = distanceFactor * (screenHeight * 0.2);
      
    // Compensation du pitch (si on pointe vers le haut, les labels descendent)
    const pitchOffset = (-pitch / 90) * (screenHeight * 0.3);
      
    const screenY = centerY - distanceOffset + pitchOffset;
    const clampedY = Math.max(50, Math.min(screenHeight - 50, screenY));

    // ==================== EFFETS DE PROFONDEUR ====================
    const depth = Math.max(0, 1 - distance / MAX_DEPTH_METERS);
    const zIndex = 1000 + Math.round(depth * 1000);
      
    // Scale plus progressif
    const scale = 0.7 + 0.5 * depth; // 0.7 (loin) -> 1.2 (près)
      
    // Opacity plus visible
    const opacity = 0.6 + 0.4 * depth; // 0.6 -> 1.0

    const distanceText = distance < 1000 
      ? `${distance.toFixed(0)} m` 
      : `${(distance / 1000).toFixed(1)} km`;

    // ==================== RENDU DU MARQUEUR ====================
    const element = (
      <View
        key={name}
        pointerEvents="none"
        style={[
          styles.marker,
          { 
            left: clampedX, 
            top: clampedY, 
            zIndex,
            transform: [
              { translateX: -name.length * 3.5 }, // Centrage du texte
              { translateY: -15 }, // Ajustement vertical
              { scale }
            ],
            opacity
          }
        ]}
      >
        <Text style={styles.markerText}>{name}</Text>
        <Text style={styles.markerDistanceText}>{distanceText}</Text>
      </View>
    );

    items.push({ element, distance, bearing: targetBearing });
  });

  // Tri par distance (proche → loin)
  items.sort((a, b) => a.distance - b.distance);
  return items.map(i => i.element);
}, [location, heading, pitch]);

  // ==================== GESTION DES PERMISSIONS ====================
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Vérification des permissions…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permission caméra requise</Text>
      </View>
    );
  }

  // ==================== RENDU FINAL ====================
  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="back" 
        active={true} 
      />
      {arMarkers}
      <View style={styles.overlay} pointerEvents="none">
        {location ? (
          <Text style={styles.overlayText}>
            Azimut: {heading.toFixed(1)}° | Pitch: {pitch.toFixed(1)}° | 
            POIs: {arMarkers.length}
          </Text>
        ) : (
          <Text style={styles.overlayText}>
            {errorMsg || 'En attente de localisation...'}
          </Text>
        )}
      </View>
    </View>
  );
}