import geoJsonData from '@/assets/geodata/IMT_EntitesRemarquables.json';
import FeatureModal from '@/components/FeatureModal';
import ReturnButton from '@/components/ReturnButton';
import { FOV_MARGIN, HEADING_DEADZONE, HEADING_OFFSET, HORIZONTAL_FOV, HYSTERESIS_DEG, MAX_DEPTH_METERS, MAX_DISTANCE, MIN_DISTANCE, PITCH_DEADZONE, SMOOTHING_ALPHA_HEADING, SMOOTHING_ALPHA_PITCH, VIS_STICK_MS } from '@/constants/camera_settings';
import { HEIGHT_SCREEN, WIDTH_SCREEN } from '@/constants/phone_dimensions';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { useDevicePitch, useOrientation } from '@/hooks/useDeviceOrietation';
import { useLocation } from '@/hooks/useLocation';
import { markerStyle } from '@/style/marker/marker_style';
import { screenStyle } from '@/style/screen/screen_style';
import { textStyle } from '@/style/text/text_style';
import { calculateVisibility } from '@/utils/calcHeight';
import { calculateBearing, calculateDistance } from '@/utils/calcLocation';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const { location, errorMsg } = useLocation();
  const deviceHeading = useOrientation();
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

      // Zona muerta: ignorar cambios pequeños para más estabilidad
      if (Math.abs(delta) < HEADING_DEADZONE) {
        return prev;
      }

      const newHeading = (prev + SMOOTHING_ALPHA_HEADING * delta + 360) % 360;
      prevHeadingRef.current = newHeading;
      return newHeading;
    });
  }, [deviceHeading]);

  // Lissage du pitch (ADDED)
  const [smoothedPitch, setSmoothedPitch] = useState(rawPitch);
  useEffect(() => {
    setSmoothedPitch(prev => {
      const delta = rawPitch - prev;

      // Zona muerta: ignorar cambios pequeños para más estabilidad
      if (Math.abs(delta) < PITCH_DEADZONE) {
        return prev;
      }

      return prev + SMOOTHING_ALPHA_PITCH * delta;
    });
  }, [rawPitch]);

  // Appliquer un éventuel décalage fixe 
  const heading = (smoothedHeading + HEADING_OFFSET + 360) % 360;
  const pitch = smoothedPitch;

  const [permission, requestPermission] = useCameraPermissions(); // ADDED

  // Refs and selection state for markers / modal
  const markerRefs = useRef<any[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Read persisted sea level and delta so visibility reflects saved values
  const { features: persistedFeatures, seaLevel, delta, maxDistance } = useDataPersistence(geoJsonData as any);
  const seaLevelValue = parseFloat(String(seaLevel).replace(',', '.')) || 0;
  const deltaValue = parseFloat(String(delta).replace(',', '.')) || 0;
  const maxDistanceValue = parseFloat(String(maxDistance).replace(',', '.')) || MAX_DISTANCE;

  // For the selected feature (e.g., when tapping a marker) compute current visibility
  const selectedVisibility = selectedFeature
    ? (() => {
      const alt1 = parseFloat(selectedFeature?.properties?.altitude || '0');
      const { isVisible } = calculateVisibility(alt1, seaLevelValue, deltaValue);
      return isVisible ? 'VISIBLE' : 'SUBMERGED';
    })()
    : null;

  useEffect(() => {                                              
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  //Mémorise le dernier instant où un POI a été visible
  const lastVisibleRef = useRef<Record<string, number>>({});

  // ==================== CALCUL DES MARQUEURS AR ====================
  const arMarkers = useMemo(() => {
    if (!location?.coords) return [];

    const items: Array<{ element: React.ReactElement; distance: number; bearing: number; }> = [];

    (persistedFeatures && persistedFeatures.length ? persistedFeatures : geoJsonData.features).forEach((feature: any) => {
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
      const targetCoords = { latitude: coords[1], longitude: coords[0] };

      //Calcul de la distance et de la direction du rocher 
      const distance = calculateDistance(location.coords, targetCoords);
      const targetBearing = calculateBearing(location.coords, targetCoords);

      // --- visibilité selon altitude / niveau de la mer (persisted values)
      const alt1 = parseFloat(feature?.properties?.altitude || '0');
      const { isVisible: isVisibleByHeight } = calculateVisibility(alt1, seaLevelValue, deltaValue);

      // COMENTADO: Mostrar todas las rocas independientemente del nivel del mar
      // Se a rocha for considerada visível pelo cálculo (ou seja, não submersa), não mostrar o card
      // if (isVisibleByHeight) return;

      // Filtrer par distance
      if (distance < MIN_DISTANCE) return;

      // If the rock is submerged AND farther than maxDistance, don't show it
      if (!isVisibleByHeight && distance > maxDistanceValue) return;

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

      // ==================== VISIBILITÉ VERTICALE ====================
      // TEMPORAL: Desactivar filtro vertical para ver todas las rocas
      // const expectedVerticalAngle = Math.atan2(0, distance) * (180 / Math.PI);
      // const verticalTolerance = 60; // Tolerancia muy amplia
      // const pitchDifference = Math.abs(-pitch - expectedVerticalAngle);
      // const isVertOK = pitchDifference < verticalTolerance;
      // if (!isVertOK) return;

      // ==================== PROJECTION HORIZONTALE (X) ====================
      const halfFovRad = (HORIZONTAL_FOV / 2) * Math.PI / 180;
      const angRad = angleDifference * Math.PI / 180;

      // Limite de sécurité pour éviter tan() → ∞
      const EPS_DEG = 1;
      const maxAngRad = ((HORIZONTAL_FOV / 2 - EPS_DEG) * Math.PI) / 180;
      const angRadClamped = Math.max(-maxAngRad, Math.min(maxAngRad, angRad));

      // Projection en perspective
      const normX = Math.tan(angRadClamped) / Math.tan(halfFovRad);
      const screenX = WIDTH_SCREEN / 2 + (normX * WIDTH_SCREEN) / 2;
      const clampedX = Math.max(20, Math.min(WIDTH_SCREEN - 20, screenX));

      // ==================== PROJECTION VERTICALE (Y) AMÉLIORÉE ====================
      // Position Y basée sur:
      // 1. Distance (plus loin = plus haut vers horizon)
      // 2. Pitch du téléphone (compensation)

      const distanceFactor = Math.min(distance / MAX_DEPTH_METERS, 1);

      // Position de base au centre de l'écran
      const centerY = HEIGHT_SCREEN * 0.5;

      // Décalage basé sur la distance (loin = monte vers horizon)
      const distanceOffset = distanceFactor * (HEIGHT_SCREEN * 0.2);

      // Compensation du pitch (si on pointe vers le haut, les labels descendent)
      const pitchOffset = (-pitch / 90) * (HEIGHT_SCREEN * 0.3);

      const screenY = centerY - distanceOffset + pitchOffset;
      const clampedY = Math.max(50, Math.min(HEIGHT_SCREEN - 50, screenY));

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
        <TouchableOpacity
          key={name}
          activeOpacity={0.8}
          onPress={() => {
            setSelectedFeature(feature);
            setModalVisible(true);
          }}
          style={[
            markerStyle.marker,
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
          <Text style={markerStyle.markerText}>{name}</Text>
          <Text style={markerStyle.markerDistanceText}>{distanceText}</Text>
        </TouchableOpacity>
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
      <View style={screenStyle.container}>
        <Text>Vérification des permissions…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={screenStyle.container}>
        <Text>Permission caméra requise</Text>
      </View>
    );
  }

  // ==================== RENDU FINAL ====================
  return (
    <View style={screenStyle.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        active={true}
      />
      {arMarkers}
      <View style={textStyle.overlay} pointerEvents="none">
        {location ? (
          <Text style={textStyle.overlayText}>
            Azimut: {heading.toFixed(1)}° | Pitch: {pitch.toFixed(1)}° |
            POIs: {arMarkers.length}
          </Text>
        ) : (
          <Text style={textStyle.overlayText}>
            {errorMsg || 'En attente de localisation...'}
          </Text>
        )}
      </View>

      <ReturnButton />

      {/* Modal detalhado para o marcador selecionado (reutilizável) */}
      <FeatureModal
        visible={modalVisible}
        feature={selectedFeature}
        seaLevel={seaLevelValue}
        delta={deltaValue}
        onClose={() => {
          setModalVisible(false);
          setSelectedFeature(null);
        }}
      />
    </View>
  );
}