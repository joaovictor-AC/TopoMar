import geojson from "@/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import { Feature } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Define a file URI in the app's persistent document directory
const FILE_URI = FileSystem.documentDirectory + "myGeoData.json";

export default function WaterLevelScreen() {
    // Keep the original data as a fallback
    const initial = (geojson as any).features as Feature[] || [];
    
    // Set initial state from the file, it will be updated from storage
    const [features, setFeatures] = useState<Feature[]>(
        initial.map((f) => ({ ...f }))
    );
    const [isLoading, setIsLoading] = useState(true);
    
    // State for sea level height (HE - Hauteur de la mer)
    const [seaLevel, setSeaLevel] = useState<string>("0");

    // Load saved data when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                // Check if the file exists first
                const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
                if (fileInfo.exists) {
                    // If it exists, read it
                    const fileContents = await FileSystem.readAsStringAsync(FILE_URI);
                    const savedData = JSON.parse(fileContents);
                    if (savedData.features) {
                        setFeatures(savedData.features as Feature[]);
                    }
                    // Load saved sea level if exists
                    if (savedData.seaLevel !== undefined) {
                        setSeaLevel(String(savedData.seaLevel));
                    }
                }
                // If the file doesn't exist, state remains 'initial'
            } catch (e) {
                console.error("Failed to load data from file system", e);
                Alert.alert("Error", "Unable to load saved data.");
            } finally {
                setIsLoading(false); // Done loading
            }
        };

        loadData();
    }, [initial]); // 'initial' is stable, so this runs once on mount

    /**
     * Calculate visibility of rock based on sea level
     * Formula: visibility = Alt1 - HE
     * If visibility < 0, rock is submerged (not visible)
     * If visibility >= 0, rock is visible
     */
    const calculateVisibility = (alt1: number | null | undefined, seaLevelValue: number): { 
        isVisible: boolean; 
        visibilityHeight: number | null;
    } => {
        if (alt1 === null || alt1 === undefined || isNaN(alt1)) {
            return { isVisible: false, visibilityHeight: null };
        }
        
        const visibilityHeight = alt1 - seaLevelValue;
        return {
            isVisible: visibilityHeight >= 0,
            visibilityHeight: visibilityHeight
        };
    };

    // Function to save data to the file
    const saveAndExport = useCallback(async () => {
        const out = { 
            ...(geojson as any), 
            features,
            seaLevel: parseFloat(seaLevel) || 0
        };
        try {
            // Stringify the updated GeoJSON structure
            const jsonValue = JSON.stringify(out);
            // Write the string to the file
            await FileSystem.writeAsStringAsync(FILE_URI, jsonValue);
            Alert.alert("Saved", "Changes have been written to the file.");
            console.log("Updated geojson saved to file:", FILE_URI);
        } catch (e) {
            console.error("Failed to save data", e);
            Alert.alert("Error", "Unable to save changes.");
        }
    }, [features, seaLevel]);

    // Function to reset data to default
    const resetData = useCallback(async () => {
        Alert.alert(
            "Reset",
            "Do you really want to delete the saved file and revert to default data?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Delete the file and reset state
                            await FileSystem.deleteAsync(FILE_URI, { idempotent: true });
                            setFeatures(initial.map((f) => ({ ...f })));
                            setSeaLevel("0");
                            Alert.alert("Reset", "Data has been reset.");
                        } catch (e) {
                            console.error("Failed to reset data", e);
                            Alert.alert("Error", "Unable to reset data.");
                        }
                    },
                },
            ]
        );
    }, [initial]);

    // Show a loading indicator while checking for the file
    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text>Loading data...</Text>
            </View>
        );
    }

    const seaLevelValue = parseFloat(seaLevel) || 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Water Level Calculator</Text>
            
            {/* Sea Level Input (HE) */}
            <View style={styles.seaLevelCard}>
                <Text style={styles.seaLevelLabel}>Sea Level Height (HE) in meters:</Text>
                <TextInput
                    style={styles.seaLevelInput}
                    value={seaLevel}
                    keyboardType="numeric"
                    onChangeText={setSeaLevel}
                    placeholder="Enter sea level (e.g., 4.5)"
                />
                <Text style={styles.helperText}>
                    Current sea level: {seaLevelValue.toFixed(2)} m
                </Text>
            </View>

            <FlatList
                data={features}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                    const name = item.properties?.nom ?? `#${index + 1}`;
                    const alt1 = item.properties?.alt1;
                    const alt2 = item.properties?.alt2;
                    
                    // Calculate visibility
                    const { isVisible, visibilityHeight } = calculateVisibility(alt1, seaLevelValue);
                    
                    return (
                        <View style={[
                            styles.card,
                            !isVisible && styles.cardSubmerged
                        ]}>
                            <View style={styles.row}>
                                <Text style={styles.name}>{name}</Text>
                                <View style={[
                                    styles.visibilityBadge,
                                    isVisible ? styles.badgeVisible : styles.badgeSubmerged
                                ]}>
                                    <Text style={styles.badgeText}>
                                        {isVisible ? "VISIBLE" : "SUBMERGED"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Alt1 (reference):</Text>
                                <Text style={styles.value}>
                                    {alt1 !== null && alt1 !== undefined ? `${alt1} m` : "N/A"}
                                </Text>
                            </View>

                            {alt2 !== null && alt2 !== undefined && (
                                <View style={styles.dataRow}>
                                    <Text style={styles.label}>Alt2:</Text>
                                    <Text style={styles.value}>{alt2} m</Text>
                                </View>
                            )}

                            <View style={styles.dataRow}>
                                <Text style={styles.label}>Sea Level (HE):</Text>
                                <Text style={styles.value}>{seaLevelValue.toFixed(2)} m</Text>
                            </View>

                            {visibilityHeight !== null && (
                                <View style={styles.dataRow}>
                                    <Text style={[styles.label, styles.labelBold]}>
                                        Visibility (Alt1 - HE):
                                    </Text>
                                    <Text style={[
                                        styles.value,
                                        styles.valueBold,
                                        visibilityHeight < 0 ? styles.valueNegative : styles.valuePositive
                                    ]}>
                                        {visibilityHeight.toFixed(2)} m
                                    </Text>
                                </View>
                            )}

                            <View style={styles.infoBox}>
                                <Text style={styles.infoText}>
                                    {isVisible 
                                        ? `✓ Rock is ${visibilityHeight?.toFixed(2)}m above water`
                                        : `✗ Rock is ${Math.abs(visibilityHeight || 0).toFixed(2)}m below water`
                                    }
                                </Text>
                            </View>
                        </View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={{ paddingBottom: 32 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.action} onPress={saveAndExport}>
                    <Text style={styles.actionText}>Save Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.action, styles.actionReset]}
                    onPress={resetData}
                >
                    <Text style={styles.actionText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: "#f7f7f7" 
    },
    title: { 
        fontSize: 22, 
        fontWeight: "700", 
        marginBottom: 16,
        color: "#1a1a1a"
    },
    seaLevelCard: {
        backgroundColor: "#e3f2fd",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#2196f3",
    },
    seaLevelLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1565c0",
        marginBottom: 8,
    },
    seaLevelInput: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#2196f3",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 18,
        fontWeight: "600",
        color: "#1565c0",
    },
    helperText: {
        marginTop: 8,
        fontSize: 14,
        color: "#1565c0",
        fontStyle: "italic",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    cardSubmerged: {
        backgroundColor: "#ffebee",
        borderColor: "#ef5350",
        borderWidth: 2,
    },
    row: { 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 12,
    },
    name: { 
        fontSize: 18, 
        fontWeight: "700", 
        flex: 1,
        color: "#1a1a1a",
    },
    visibilityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 8,
    },
    badgeVisible: {
        backgroundColor: "#4caf50",
    },
    badgeSubmerged: {
        backgroundColor: "#f44336",
    },
    badgeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },
    dataRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: "#666",
    },
    labelBold: {
        fontWeight: "700",
        color: "#1a1a1a",
        fontSize: 15,
    },
    value: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    valueBold: {
        fontSize: 16,
        fontWeight: "700",
    },
    valuePositive: {
        color: "#4caf50",
    },
    valueNegative: {
        color: "#f44336",
    },
    infoBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#2196f3",
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    footer: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    action: {
        backgroundColor: "#2196f3",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 6,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionReset: {
        backgroundColor: "#f44336",
    },
    actionText: { 
        color: "#fff", 
        fontWeight: "700",
        fontSize: 16,
    },
});