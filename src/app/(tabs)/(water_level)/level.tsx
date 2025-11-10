import geojson from "@/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import { Feature } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
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
    const [seaLevel, setSeaLevel] = useState<string>("4.5");
    
    // State for filtering rocks by visibility
    const [filter, setFilter] = useState<'all' | 'visible' | 'submerged'>('all');
    
    // State for search query
    const [searchQuery, setSearchQuery] = useState<string>("");

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
     * 
     * @param alt1 - Height above sea level (hauteurAuDessusNiveauMer)
     * @param seaLevelValue - Current sea level height (HE)
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
            seaLevel: parseFloat(seaLevel.replace(',', '.')) || 0
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

    // Convert comma to point for decimal parsing (e.g., "4,5" -> "4.5")
    const seaLevelValue = parseFloat(seaLevel.replace(',', '.')) || 0;

    // Calculate statistics
    const stats = features.reduce((acc, feature) => {
        // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
        const alt1 = parseFloat(feature.properties?.hauteurAuDessusNiveauMer || "0");
        const { isVisible } = calculateVisibility(alt1, seaLevelValue);
        
        if (isVisible) {
            acc.visible++;
        } else {
            acc.submerged++;
        }
        return acc;
    }, { visible: 0, submerged: 0 });

    // Filter features based on visibility and search
    const filteredFeatures = features.filter(feature => {
        // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
        const alt1 = parseFloat(feature.properties?.hauteurAuDessusNiveauMer || "0");
        const { isVisible } = calculateVisibility(alt1, seaLevelValue);
        const name = feature.properties?.nom?.toLowerCase() || "";
        
        // Filter by visibility
        if (filter === 'visible' && !isVisible) return false;
        if (filter === 'submerged' && isVisible) return false;
        
        // Filter by search query
        if (searchQuery && !name.includes(searchQuery.toLowerCase())) return false;
        
        return true;
    });

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                <Text style={styles.title}>Water Level Calculator</Text>
                
                {/* Sea Level Input (HE) */}
                <View style={styles.seaLevelCard}>
                    <Text style={styles.seaLevelLabel}>Sea Level Height (HE) in meters:</Text>
                    <TextInput
                        style={styles.seaLevelInput}
                        value={seaLevel}
                        keyboardType="numeric"
                        onChangeText={setSeaLevel}
                        placeholder="Enter sea level (e.g., 4.5 or 4,5)"
                    />
                    <Text style={styles.helperText}>
                        Current sea level: {seaLevelValue.toFixed(2)} m (You can use . or ,)
                    </Text>
                </View>

                {/* Statistics Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{features.length}</Text>
                        <Text style={styles.statLabel}>Total Rocks</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, styles.statVisible]}>{stats.visible}</Text>
                        <Text style={styles.statLabel}>Visible</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, styles.statSubmerged]}>{stats.submerged}</Text>
                        <Text style={styles.statLabel}>Submerged</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search rocks by name..."
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={() => setSearchQuery("")}
                        >
                            <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Buttons */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All ({features.length})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'visible' && styles.filterButtonActive]}
                        onPress={() => setFilter('visible')}
                    >
                        <Text style={[styles.filterText, filter === 'visible' && styles.filterTextActive]}>
                            🟢 Visible ({stats.visible})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.filterButton, filter === 'submerged' && styles.filterButtonActive]}
                        onPress={() => setFilter('submerged')}
                    >
                        <Text style={[styles.filterText, filter === 'submerged' && styles.filterTextActive]}>
                            🔴 Submerged ({stats.submerged})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Results count */}
                <Text style={styles.resultsText}>
                    Showing {filteredFeatures.length} rock{filteredFeatures.length !== 1 ? 's' : ''}
                    {searchQuery && ` matching "${searchQuery}"`}
                </Text>

                {/* Rocks List */}
                {filteredFeatures.map((item, index) => {
                    const name = item.properties?.nom ?? `#${index + 1}`;
                    // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
                    const alt1 = parseFloat(item.properties?.hauteurAuDessusNiveauMer || "0");
                    const alt2 = item.properties?.alt2;
                    
                    // Calculate visibility
                    const { isVisible, visibilityHeight } = calculateVisibility(alt1, seaLevelValue);
                    
                    return (
                        <View 
                            key={index}
                            style={[
                                styles.card,
                                !isVisible && styles.cardSubmerged,
                                index < filteredFeatures.length - 1 && styles.cardMarginBottom
                            ]}
                        >
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
                                <Text style={styles.label}>Height above sea level:</Text>
                                <Text style={styles.value}>
                                    {alt1 !== null && !isNaN(alt1) ? `${alt1} m` : "N/A"}
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
                                        Visibility (Height - HE):
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
                })}
            </ScrollView>

            {/* Footer Section - Fixed at bottom */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.action} onPress={saveAndExport}>
                    <Text style={styles.actionText}>💾 Save Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.action, styles.actionSecondary]}
                    onPress={() => {
                        // Export visible rocks list
                        const visibleRocks = features
                            .filter(f => {
                                // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
                                const alt1 = parseFloat(f.properties?.hauteurAuDessusNiveauMer || "0");
                                const { isVisible } = calculateVisibility(alt1, seaLevelValue);
                                return isVisible;
                            })
                            .map(f => f.properties?.nom)
                            .join(', ');
                        
                        Alert.alert(
                            "Visible Rocks List",
                            visibleRocks || "No visible rocks at this sea level",
                            [{ text: "OK" }]
                        );
                    }}
                >
                    <Text style={styles.actionText}>📋 Export Visible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.action, styles.actionReset]}
                    onPress={resetData}
                >
                    <Text style={styles.actionText}>🔄 Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#f7f7f7" 
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100, // Space for footer buttons
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
    statsCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        alignItems: "center",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    statVisible: {
        color: "#4caf50",
    },
    statSubmerged: {
        color: "#f44336",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
        textTransform: "uppercase",
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#e0e0e0",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: "#1a1a1a",
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        fontSize: 18,
        color: "#999",
        fontWeight: "600",
    },
    filterContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        alignItems: "center",
    },
    filterButtonActive: {
        backgroundColor: "#2196f3",
        borderColor: "#2196f3",
    },
    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
    },
    filterTextActive: {
        color: "#fff",
    },
    resultsText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
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
    cardMarginBottom: {
        marginBottom: 12,
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
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 8,
        padding: 16,
        paddingBottom: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
        elevation: 8,
    },
    action: {
        backgroundColor: "#2196f3",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionSecondary: {
        backgroundColor: "#ff9800",
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