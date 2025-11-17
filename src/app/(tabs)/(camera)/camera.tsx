import geoJsonData from "@/assets/geodata/IMT_EntitesRemarquables.json";
import { useDevicePitch, useOrientation } from "@/hooks/useDeviceOrietation";
import { useLocation } from "@/hooks/useLocation";
import { markerStyle } from "@/style/marker/marker_style";
import { screenStyle } from "@/style/screen/screen_style";
import { Coordinates } from "@/types/locationTypes";
import { calculateBearing, calculateDistance } from "@/utils/calcLocation";
import { CameraView } from "expo-camera";
import { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

// Constants for AR marker visibility and placement
const ANGLE_VIEW = 80; // Field of view angle for marker display
const MAX_DIST = 3000; // Maximum distance (in meters) to show markers
const ANGLE_PITCH = 40; // Minimum pitch angle to show markers
const { width: screenWidth } = Dimensions.get("window"); // Get device screen width

export default function CameraScreen() {
    // Get current location, heading (compass), and pitch (tilt) from custom hooks
    const { location, errorMsg } = useLocation();
    const heading = useOrientation();
    const pitch = useDevicePitch();

    // Memoized calculation of AR markers to display on the camera view
    const arMarks = useMemo(() => {
        if (!location || !location.coords) {
            // If location is not available, return empty array
            return [];
        }

        // Map each feature from GeoJSON to a marker if it meets visibility criteria
        return geoJsonData.features
            .map((feature: any) => {
                const coords = feature.geometry.coordinates;

                // Validate coordinates and distance
                if (
                    !Array.isArray(coords) ||
                    coords.length < 2 ||
                    typeof coords[0] !== "number" ||
                    typeof coords[1] !== "number"
                ) {
                    return null;
                }

                // Convert GeoJSON coordinates to latitude/longitude
                const locationTarget: Coordinates = {
                    latitude: coords[1],
                    longitude: coords[0],
                };

                // Calculate distance and bearing to the target feature
                const distanceMark = calculateDistance(location.coords, locationTarget)
                const targetBearing = calculateBearing(location.coords, locationTarget);

                // Calculate angle difference between device heading and target bearing
                let angleDifference = targetBearing - heading;
                if (angleDifference > 180) angleDifference -= 360;
                if (angleDifference < -180) angleDifference += 360;

                // Determine if the marker should be visible based on angle, pitch, and distance
                const isVisible =
                    Math.abs(angleDifference) < ANGLE_VIEW / 2 &&
                    pitch >= ANGLE_PITCH &&
                    distanceMark <= MAX_DIST;
                if (!isVisible) return null;

                // Calculate horizontal position (screenX) for the marker on the screen
                const screenX =
                    screenWidth / 2 +
                    (angleDifference / ANGLE_VIEW / 2) * (screenWidth / 2);

                // Dynamic style for marker: position, scale, and opacity based on distance
                const dynamicStyle = {
                    transform: [
                        { translateX: -feature.properties.nom.length },
                        { scale: Math.max(0.4, 1.5 - distanceMark / 2000) },
                    ],
                    opacity: Math.max(0.6, 1 - distanceMark / 4000),
                };

                // Format distance text for marker
                const distanceText =
                    distanceMark < 1000
                        ? `${distanceMark.toFixed(0)} m`
                        : `${(distanceMark / 1000).toFixed(1)} km`;

                // Render marker as a View with name and distance
                return (
                    <View
                        key={feature.properties.nom}
                        style={[markerStyle.marker, { left: screenX, top: '50%' }, dynamicStyle]}
                    >
                        <Text style={markerStyle.markerText}>{feature.properties.nom}</Text>
                        <Text style={markerStyle.markerDistanceText}>{distanceText}</Text>

                        {(feature.properties.hauteurAuDessusNiveauMer) ?
                            <Text style={markerStyle.markerDistanceText}>
                                {feature.properties.hauteurAuDessusNiveauMer} m
                            </Text> : null}

                    </View>
                );
            })
            .filter(Boolean); // Remove nulls (invisible markers)
    }, [location, heading, pitch]);


    return (
        <>

            <CameraView style={StyleSheet.absoluteFill} facing="back" />
            <View style={screenStyle.container}>
                {arMarks}
            </View>
        </>
    );
};
