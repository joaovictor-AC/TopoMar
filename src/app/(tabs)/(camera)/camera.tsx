import geoJsonData from "@/assets/geodata/IMT_EntitesRemarquables.json";
import { useDevicePitch, useOrientation } from "@/hooks/useDeviceOrietation";
import { useLocation } from "@/hooks/useLocation";
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

    // Variables to hold distance and bearing to a reference point
    let distance: number | null = null;
    let bearing: number | null = null;
    if (location !== null) {
        // Calculate distance and bearing from current location to a fixed point
        distance = calculateDistance(location.coords, { latitude: 48.3387435, longitude: -4.5758617 });
        bearing = calculateBearing(location.coords, { latitude: 48.3387435, longitude: -4.5758617 });
    }

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
                    typeof coords[1] !== "number" ||
                    distance == null
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
                    opacity: Math.max(0.6, 1 - distance / 4000),
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
                        style={[styles.marker, { left: screenX, top: '50%' }, dynamicStyle]}
                    >
                        <Text style={styles.markerText}>{feature.properties.nom}</Text>
                        <Text style={styles.markerDistanceText}>{distanceText}</Text>

                        {(feature.properties.hauteurAuDessusNiveauMer) ?
                            <Text style={styles.markerDistanceText}>
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
            <View style={styles.container}>
                {arMarks}
                <View style={styles.overlay}>
                    {location ? (
                        <>
                            <Text style={styles.text}>Your current location:</Text>
                            <Text style={styles.coordsText}>
                                Latitude: {location.coords.latitude.toFixed(5)}
                            </Text>
                            <Text style={styles.coordsText}>
                                Longitude: {location.coords.longitude.toFixed(5)}
                            </Text>
                            <Text style={styles.coordsText}>
                                Heading Location: {location.coords.heading?.toFixed(5)}
                            </Text>
                            <Text style={styles.coordsText}>
                                Heading function: {Math.round(heading)}
                            </Text>
                            <Text style={styles.coordsText}>
                                Distance: {distance}
                            </Text>
                            <Text style={styles.coordsText}>
                                Bearing: {bearing}
                            </Text>
                            <Text style={styles.coordsText}>
                                Pitch: {Math.round(pitch)}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.text}>
                            {errorMsg || 'Waiting for location...'}
                        </Text>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 15,
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    coordsText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(23, 115, 238, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        transform: [{ translateX: -50 }],
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    markerDistanceText: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 2,
    },
});
