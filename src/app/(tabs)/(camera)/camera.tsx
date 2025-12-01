import geoJsonData from "@/assets/geodata/4G6NZVR0_Toponymes.json";
import localData from "@/assets/geodata/IMT_EntitesRemarquables.json";
import { ENABLE_TEST_MODE } from "@/config/testMode";
import { useDevicePitch, useOrientation } from "@/hooks/useDeviceOrietation";
import { useLocation } from "@/hooks/useLocation";
import { Coordinates } from "@/types/locationTypes";
import { calculateBearing, calculateDistance } from "@/utils/calcLocation";
import { CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useMemo, useState } from "react";
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Constants for AR marker visibility and placement
const ANGLE_VIEW = 80; // Field of view angle for marker display
const MAX_DIST = 3000; // Maximum distance (in meters) to show markers
const ANGLE_PITCH = 40; // Minimum pitch angle to show markers
const { width: screenWidth } = Dimensions.get("window"); // Get device screen width

// Combine both GeoJSON datasets
// Main dataset with altitude data + local reference points for other areas
const combinedFeatures = [
    ...(geoJsonData as any).features,   // Rocks with altitude data (primary dataset)
    ...(ENABLE_TEST_MODE ? (localData as any).features : [])      // Test Dellec points (only in test mode)
];

export default function CameraScreen() {
    // Get current location, heading (compass), and pitch (tilt) from custom hooks
    const { location, errorMsg } = useLocation();
    const heading = useOrientation();
    const pitch = useDevicePitch();
    const router = useRouter();
    
    // State for modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRock, setSelectedRock] = useState<{
        name: string;
        lat: number;
        lon: number;
    } | null>(null);

    // Function to pronounce rock name using Text-to-Speech
    const pronounceRockName = async (name: string) => {
        try {
            // Stop any current speech
            await Speech.stop();
            // Speak the rock name in French (best for Breton names)
            await Speech.speak(name, {
                language: 'fr-FR', // French language for better pronunciation
                pitch: 1.0,
                rate: 0.85, // Slightly slower for clarity
            });
        } catch (error) {
            console.error('Error with speech:', error);
        }
    };
    
    // Function to navigate to water level screen
    const navigateToWaterLevel = () => {
        if (!selectedRock || !location) return;
        
        setModalVisible(false);
        router.push({
            pathname: '/(tabs)/(water_level)/level',
            params: {
                rockName: selectedRock.name,
                rockLat: selectedRock.lat,
                rockLon: selectedRock.lon,
                userLat: location.coords.latitude,
                userLon: location.coords.longitude,
            }
        });
    };

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

        // Map each feature from combined GeoJSON datasets to a marker if it meets visibility criteria
        return combinedFeatures
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

                // Render marker as a TouchableOpacity with name and distance
                // When tapped, navigate to water level screen with rock details
                return (
                    <TouchableOpacity
                        key={feature.properties.nom}
                        style={[styles.marker, { left: screenX, top: '50%' }, dynamicStyle]}
                        onPress={() => {
                            // Open modal with options
                            setSelectedRock({
                                name: feature.properties.nom,
                                lat: coords[1],
                                lon: coords[0],
                            });
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.markerText}>{feature.properties.nom}</Text>
                        <Text style={styles.markerDistanceText}>{distanceText}</Text>

                        {(feature.properties.altitude || feature.properties.hauteurAuDessusNiveauMer) ?
                            <Text style={styles.markerDistanceText}>
                                {feature.properties.altitude || feature.properties.hauteurAuDessusNiveauMer} m
                            </Text> : null}

                    </TouchableOpacity>
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
            
            {/* Modal with options */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/* Rock name title with water level icon */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedRock?.name}</Text>
                                <TouchableOpacity
                                    style={styles.waterLevelIconButton}
                                    onPress={navigateToWaterLevel}
                                >
                                    <Text style={styles.waterLevelIcon}>📊</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Divider */}
                            <View style={styles.modalDivider} />
                            
                            {/* Pronunciation button */}
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    if (selectedRock) {
                                        pronounceRockName(selectedRock.name);
                                    }
                                }}
                            >
                                <Text style={styles.modalButtonIcon}>🔊</Text>
                                <Text style={styles.modalButtonText}>Pronounce</Text>
                            </TouchableOpacity>
                            
                            {/* Description button (placeholder for future) */}
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSecondary]}
                                onPress={() => {
                                    // TODO: Navigate to description screen
                                    setModalVisible(false);
                                    Alert.alert('Coming Soon', 'Rock description feature will be available soon!');
                                }}
                            >
                                <Text style={styles.modalButtonIcon}>📝</Text>
                                <Text style={styles.modalButtonText}>Description</Text>
                            </TouchableOpacity>
                            
                            {/* Close button */}
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    waterLevelIconButton: {
        backgroundColor: '#f0f0f0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    waterLevelIcon: {
        fontSize: 20,
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    modalButtonSecondary: {
        backgroundColor: '#ff9800',
    },
    modalButtonIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    modalCloseButton: {
        marginTop: 8,
        padding: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});
