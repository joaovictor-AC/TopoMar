// CameraScreen.tsx
import { CameraView } from "expo-camera";
import { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

// Hooks + utils
import { useDeviceQuaternion } from "../../../hooks/useDeviceQuaternion";
import { useLocation } from "../../../hooks/useLocation";
import {
  latLonToLocalMeters,
  mat3MulVec,
  quatToMat3,
} from "../../../utils/pose";
import { projectToScreen } from "../../../utils/project";

// JSON GeoData
import geoJsonData from "../../../assets/geodata/kerlouan.json";

const { width: WIDTH_SCREEN, height: HEIGHT_SCREEN } = Dimensions.get("window");
const HORIZONTAL_FOV = 50;
const MIN_DISTANCE = 50;
const MAX_DISTANCE = 5000;

export default function CameraScreen() {
  // 1️⃣ Position utilisateur
  const { location, errorMsg } = useLocation();

  // 2️⃣ Quaternion appareil
  const { qx, qy, qz, qw } = useDeviceQuaternion({ intervalMs: 50, smoothT: 0.18 });

  // 3️⃣ Calcul AR markers
  const arMarkers = useMemo(() => {
    if (!location?.coords) return [];

    const mat = quatToMat3(qx, qy, qz, qw);
    const matWorldToDevice = [
      [mat[0][0], mat[1][0], mat[2][0]],
      [mat[0][1], mat[1][1], mat[2][1]],
      [mat[0][2], mat[1][2], mat[2][2]],
    ];

    const items: any[] = [];

    geoJsonData.features.forEach((feature: any) => {
      const [lon2, lat2] = feature.geometry.coordinates;

      const { east, north, up } = latLonToLocalMeters(
        location.coords.latitude,
        location.coords.longitude,
        lat2,
        lon2
      );

      const worldVec = { x: east, y: north, z: up };
      const devVec = mat3MulVec(matWorldToDevice, worldVec);

      const proj = projectToScreen(devVec, WIDTH_SCREEN, HEIGHT_SCREEN, HORIZONTAL_FOV);
      if (!proj) return;

      const distance = Math.hypot(east, north, up);
      if (distance < MIN_DISTANCE || distance > MAX_DISTANCE) return;

      const element = (
        <View
          key={feature.properties.nom}
          pointerEvents="none"
          style={[
            styles.marker,
            {
              left: proj.screenX,
              top: proj.screenY,
              zIndex: 10000 - Math.round(distance),
            },
          ]}
        >
          <Text style={styles.markerText}>{feature.properties.nom}</Text>
          <Text style={styles.markerDistanceText}>
            {distance < 1000
              ? `${distance.toFixed(0)} m`
              : `${(distance / 1000).toFixed(1)} km`}
          </Text>
        </View>
      );

      items.push({ distance, element });
    });

    items.sort((a, b) => a.distance - b.distance);
    return items.map((item) => item.element);
  }, [location, qx, qy, qz, qw]);

  // 4️⃣ Affichage
  if (!location) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg || "En attente de localisation..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} active={true} facing="back" />
      {arMarkers}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    position: "absolute",
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
  },
  markerText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  markerDistanceText: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
  },
});
