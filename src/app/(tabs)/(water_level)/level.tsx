import mainData from "@/assets/geodata/4G6NZVR0_Toponymes.json";
import localData from "@/assets/geodata/IMT_EntitesRemarquables.json";
import { ENABLE_TEST_MODE } from "@/config/testMode";
import { Feature } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
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

// Combine both GeoJSON datasets
const combinedGeoJson = {
    ...(mainData as any),
    features: [
        ...(mainData as any).features,   // Rocks with altitude data
        ...(ENABLE_TEST_MODE ? (localData as any).features : [])   // Test Dellec points (only in test mode)
    ]
};

export default function WaterLevelScreen() {
    // Get navigation parameters (from camera screen)
    const params = useLocalSearchParams();
    const rockName = params.rockName as string | undefined;
    const rockLat = params.rockLat ? parseFloat(params.rockLat as string) : undefined;
    const rockLon = params.rockLon ? parseFloat(params.rockLon as string) : undefined;
    const userLat = params.userLat ? parseFloat(params.userLat as string) : undefined;
    const userLon = params.userLon ? parseFloat(params.userLon as string) : undefined;
    
    // Keep the original combined data as a fallback
    const initial = combinedGeoJson.features as Feature[] || [];
    
    // Set initial state from the file, it will be updated from storage
    const [features, setFeatures] = useState<Feature[]>(
        initial.map((f) => ({ ...f }))
    );
    const [isLoading, setIsLoading] = useState(true);
    
    // State for sea level height (HE - Hauteur de la mer)
    const [seaLevel, setSeaLevel] = useState<string>("4.5");
    
    // State for delta adjustment value
    const [delta, setDelta] = useState<string>("4.5");
    
    // State for filtering by type: 'rocks' (with altitude), 'references' (without altitude), 'all'
    const [typeFilter, setTypeFilter] = useState<'all' | 'rocks' | 'references'>('all');
    
    // State for filtering rocks by visibility (only applies to rocks with altitude data)
    const [filter, setFilter] = useState<'all' | 'visible' | 'atSeaLevel' | 'submerged'>('all');
    
    // State for search query
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    // State for view mode: 'single' (one item), 'nearby' (items near selected), 'all' (all items)
    const [viewMode, setViewMode] = useState<'single' | 'nearby' | 'all'>(rockName ? 'single' : 'all');
    
    // Distance threshold for "nearby" items (in meters)
    const NEARBY_DISTANCE = 500;

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
                    // Load saved delta if exists
                    if (savedData.delta !== undefined) {
                        setDelta(String(savedData.delta));
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
     * Calculate visibility of rock based on sea level and delta
     * Formula: visibility = Alt1 + Delta - HE
     * If visibility < 0, rock is submerged (not visible)
     * If visibility >= 0, rock is visible
     * If |visibility| < 0.01m (1cm), rock is exactly at sea level
     * 
     * @param alt1 - Height above sea level (hauteurAuDessusNiveauMer)
     * @param deltaValue - Delta adjustment value
     * @param seaLevelValue - Current sea level height (HE)
     */
    const calculateVisibility = (alt1: number | null | undefined, deltaValue: number, seaLevelValue: number): { 
        isVisible: boolean; 
        visibilityHeight: number | null;
        isAtSeaLevel: boolean;
    } => {
        if (alt1 === null || alt1 === undefined || isNaN(alt1)) {
            return { isVisible: false, visibilityHeight: null, isAtSeaLevel: false };
        }
        
        const visibilityHeight = alt1 + deltaValue - seaLevelValue;
        const isAtSeaLevel = Math.abs(visibilityHeight) < 0.01; // Consideramos "al nivel del mar" si la diferencia es menor a 1cm
        return {
            isVisible: visibilityHeight > 0,
            visibilityHeight: visibilityHeight,
            isAtSeaLevel: isAtSeaLevel
        };
    };

    // Function to save data to the file
    const saveAndExport = useCallback(async () => {
        const out = { 
            ...combinedGeoJson, 
            features,
            seaLevel: parseFloat(seaLevel.replace(',', '.')) || 0,
            delta: parseFloat(delta.replace(',', '.')) || 0
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
    }, [features, seaLevel, delta]);

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
                            setSeaLevel("4.5");
                            setDelta("4.5");
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
    const deltaValue = parseFloat(delta.replace(',', '.')) || 0;

    // Calculate statistics
    const stats = features.reduce((acc, feature) => {
        // Use altitude or hauteurAuDessusNiveauMer from JSON (convert string to number)
        const heightStr = feature.properties?.altitude || feature.properties?.hauteurAuDessusNiveauMer;
        const hasAltitude = heightStr && heightStr !== "0" && heightStr !== "";
        
        if (!hasAltitude) {
            acc.references++;
        } else {
            const alt1 = parseFloat(heightStr || "0");
            const { isVisible, isAtSeaLevel } = calculateVisibility(alt1, deltaValue, seaLevelValue);
            
            acc.rocks++;
            if (isAtSeaLevel) {
                acc.atSeaLevel++;
            } else if (isVisible) {
                acc.visible++;
            } else {
                acc.submerged++;
            }
        }
        return acc;
    }, { rocks: 0, visible: 0, submerged: 0, atSeaLevel: 0, references: 0 });

    // Filter features based on type, view mode, visibility, and search
    const filteredFeatures = features.filter(feature => {
        // Use altitude or hauteurAuDessusNiveauMer from JSON (convert string to number)
        const heightStr = feature.properties?.altitude || feature.properties?.hauteurAuDessusNiveauMer;
        const hasAltitude = heightStr && heightStr !== "0" && heightStr !== "";
        const alt1 = parseFloat(heightStr || "0");
        const { isVisible, isAtSeaLevel } = calculateVisibility(alt1, deltaValue, seaLevelValue);
        const name = feature.properties?.nom?.toLowerCase() || "";
        
        // Filter by type (rocks with altitude vs references without altitude)
        if (typeFilter === 'rocks' && !hasAltitude) return false;
        if (typeFilter === 'references' && hasAltitude) return false;
        
        // Filter by view mode
        if (viewMode === 'single' && rockName) {
            // Show only the selected item
            if (feature.properties?.nom !== rockName) return false;
        } else if (viewMode === 'nearby' && rockLat && rockLon && userLat && userLon) {
            // Show rocks within NEARBY_DISTANCE of the selected rock
            const featureCoords = feature.geometry?.coordinates;
            if (featureCoords && Array.isArray(featureCoords) && featureCoords.length >= 2) {
                // Calculate distance using Haversine formula
                const R = 6371e3; // Earth's radius in meters
                const φ1 = (rockLat * Math.PI) / 180;
                const φ2 = (featureCoords[1] * Math.PI) / 180;
                const Δφ = ((featureCoords[1] - rockLat) * Math.PI) / 180;
                const Δλ = ((featureCoords[0] - rockLon) * Math.PI) / 180;
                
                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                         Math.cos(φ1) * Math.cos(φ2) *
                         Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c;
                
                if (distance > NEARBY_DISTANCE) return false;
            }
        }
        
        // Filter by visibility (only applies to items with altitude data)
        if (hasAltitude) {
            if (filter === 'visible' && (!isVisible || isAtSeaLevel)) return false;
            if (filter === 'atSeaLevel' && !isAtSeaLevel) return false;
            if (filter === 'submerged' && (isVisible || isAtSeaLevel)) return false;
        }
        
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
                <Text style={styles.title}>
                    {rockName ? `Selected: ${rockName}` : 'Water Level Calculator'}
                </Text>

                {/* View Mode Selector - Only show if coming from camera */}
                {rockName && (
                    <View style={styles.viewModeContainer}>
                        <TouchableOpacity 
                            style={[styles.viewModeButton, viewMode === 'single' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('single')}
                        >
                            <Text style={[styles.viewModeText, viewMode === 'single' && styles.viewModeTextActive]}>
                                📍 This Only
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.viewModeButton, viewMode === 'nearby' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('nearby')}
                        >
                            <Text style={[styles.viewModeText, viewMode === 'nearby' && styles.viewModeTextActive]}>
                                🔍 Nearby ({NEARBY_DISTANCE}m)
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.viewModeButton, viewMode === 'all' && styles.viewModeButtonActive]}
                            onPress={() => setViewMode('all')}
                        >
                            <Text style={[styles.viewModeText, viewMode === 'all' && styles.viewModeTextActive]}>
                                🌍 View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                
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

                {/* Delta Input */}
                <View style={styles.deltaCard}>
                    <Text style={styles.deltaLabel}>Delta Adjustment in meters:</Text>
                    <TextInput
                        style={styles.deltaInput}
                        value={delta}
                        keyboardType="numeric"
                        onChangeText={setDelta}
                        placeholder="Enter delta (e.g., 0 or 0,5)"
                    />
                    <Text style={styles.helperText}>
                        Current delta: {deltaValue.toFixed(2)} m (You can use . or ,)
                    </Text>
                </View>

                {/* Type Filter - Rocks vs References */}
                <View style={styles.typeFilterContainer}>
                    <TouchableOpacity 
                        style={[styles.typeFilterButton, typeFilter === 'all' && styles.typeFilterButtonActive]}
                        onPress={() => setTypeFilter('all')}
                    >
                        <Text style={[styles.typeFilterText, typeFilter === 'all' && styles.typeFilterTextActive]}>
                            All ({features.length})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.typeFilterButton, typeFilter === 'rocks' && styles.typeFilterButtonActive]}
                        onPress={() => setTypeFilter('rocks')}
                    >
                        <Text style={[styles.typeFilterText, typeFilter === 'rocks' && styles.typeFilterTextActive]}>
                            🗿 Rocks ({stats.rocks})
                        </Text>
                    </TouchableOpacity>
                    
                    {ENABLE_TEST_MODE && (
                        <TouchableOpacity 
                            style={[styles.typeFilterButton, typeFilter === 'references' && styles.typeFilterButtonActive]}
                            onPress={() => setTypeFilter('references')}
                        >
                            <Text style={[styles.typeFilterText, typeFilter === 'references' && styles.typeFilterTextActive]}>
                                🟣 Test Dellec ({stats.references})
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Statistics Card - Only show for rocks with altitude data */}
                {typeFilter !== 'references' && (
                    <View style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.rocks}</Text>
                                <Text style={styles.statLabel}>Total Rocks</Text>
                            </View>
                        </View>
                        <View style={styles.statsDividerHorizontal} />
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statNumber, styles.statVisible]}>{stats.visible}</Text>
                                <Text style={styles.statLabel}>Visible</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statNumber, styles.statAtSeaLevel]}>{stats.atSeaLevel}</Text>
                                <Text style={styles.statLabel}>At Sea Level</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statNumber, styles.statSubmerged]}>{stats.submerged}</Text>
                                <Text style={styles.statLabel}>Submerged</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={typeFilter === 'references' ? "Search Test Dellec points..." : "Search by name..."}
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

                {/* Filter Buttons - Only show for rocks with altitude data */}
                {typeFilter !== 'references' && (
                    <View style={styles.filterContainer}>
                        <TouchableOpacity 
                            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                            onPress={() => setFilter('all')}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                                All ({stats.rocks})
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
                            style={[styles.filterButton, filter === 'atSeaLevel' && styles.filterButtonActive]}
                            onPress={() => setFilter('atSeaLevel')}
                        >
                            <Text style={[styles.filterText, filter === 'atSeaLevel' && styles.filterTextActive]}>
                                🟠 At Sea Level ({stats.atSeaLevel})
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
                )}

                {/* Results count */}
                <Text style={styles.resultsText}>
                    Showing {filteredFeatures.length} {
                        typeFilter === 'rocks' ? 'rock' + (filteredFeatures.length !== 1 ? 's' : '') :
                        typeFilter === 'references' ? 'Test Dellec point' + (filteredFeatures.length !== 1 ? 's' : '') :
                        'item' + (filteredFeatures.length !== 1 ? 's' : '')
                    }
                    {searchQuery && ` matching "${searchQuery}"`}
                </Text>

                {/* Items List */}
                {filteredFeatures.map((item, index) => {
                    const name = item.properties?.nom ?? `#${index + 1}`;
                    // Use altitude or hauteurAuDessusNiveauMer from JSON (convert string to number)
                    const heightStr = item.properties?.altitude || item.properties?.hauteurAuDessusNiveauMer;
                    const hasAltitudeData = heightStr && heightStr !== "0" && heightStr !== "";
                    const alt1 = parseFloat(heightStr || "0");
                    const alt2 = item.properties?.alt2;
                    
                    // Calculate visibility (only if altitude data exists)
                    const { isVisible, visibilityHeight, isAtSeaLevel } = hasAltitudeData 
                        ? calculateVisibility(alt1, deltaValue, seaLevelValue)
                        : { isVisible: false, visibilityHeight: null, isAtSeaLevel: false };
                    
                    return (
                        <View 
                            key={index}
                            style={[
                                styles.card,
                                hasAltitudeData && isAtSeaLevel && styles.cardAtSeaLevel,
                                hasAltitudeData && !isAtSeaLevel && !isVisible && styles.cardSubmerged,
                                !hasAltitudeData && styles.cardNoData,
                                index < filteredFeatures.length - 1 && styles.cardMarginBottom
                            ]}
                        >
                            <View style={styles.row}>
                                <View style={styles.nameContainer}>
                                    <Text style={styles.name}>{name}</Text>
                                    <TouchableOpacity 
                                        style={styles.speakerButton}
                                        onPress={() => pronounceRockName(name)}
                                    >
                                        <Text style={styles.speakerIcon}>🔊</Text>
                                    </TouchableOpacity>
                                </View>
                                {hasAltitudeData ? (
                                    <View style={[
                                        styles.visibilityBadge,
                                        isAtSeaLevel ? styles.badgeAtSeaLevel : (isVisible ? styles.badgeVisible : styles.badgeSubmerged)
                                    ]}>
                                        <Text style={styles.badgeText}>
                                            {isAtSeaLevel ? "AT SEA LEVEL" : (isVisible ? "VISIBLE" : "SUBMERGED")}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={[styles.visibilityBadge, styles.badgeNoData]}>
                                        <Text style={styles.badgeText}>
                                            TEST DELLEC
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {!hasAltitudeData && (
                                <View style={styles.warningBox}>
                                    <Text style={styles.warningText}>
                                        ⚠️ No altitude data available for this location. This is a Test Dellec point only.
                                    </Text>
                                </View>
                            )}

                            {hasAltitudeData && (
                                <>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.label}>Rock Altitude (base level):</Text>
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

                                    <View style={styles.dataRow}>
                                        <Text style={styles.label}>Delta Adjustment:</Text>
                                        <Text style={styles.value}>{deltaValue.toFixed(2)} m</Text>
                                    </View>

                                    {visibilityHeight !== null && (
                                        <View style={styles.dataRow}>
                                            <Text style={[styles.label, styles.labelBold]}>
                                                Visibility (Height + Delta - HE):
                                            </Text>
                                            <Text style={[
                                                styles.value,
                                                styles.valueBold,
                                                isAtSeaLevel ? styles.valueAtSeaLevel : (visibilityHeight < 0 ? styles.valueNegative : styles.valuePositive)
                                            ]}>
                                                {visibilityHeight.toFixed(2)} m
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.infoBox}>
                                        <Text style={styles.infoText}>
                                            {isAtSeaLevel
                                                ? `⚠️ Rock is exactly at sea level (${Math.abs(visibilityHeight || 0).toFixed(2)}m difference)`
                                                : isVisible 
                                                    ? `✓ Rock is ${visibilityHeight?.toFixed(2)}m above water`
                                                    : `✗ Rock is ${Math.abs(visibilityHeight || 0).toFixed(2)}m below water`
                                            }
                                        </Text>
                                    </View>
                                </>
                            )}

                            {item.properties?.featureType && (
                                <View style={styles.dataRow}>
                                    <Text style={styles.label}>Type:</Text>
                                    <Text style={styles.value}>{item.properties.featureType}</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
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
        paddingBottom: 16,
    },
    title: { 
        fontSize: 22, 
        fontWeight: "700", 
        marginBottom: 16,
        color: "#1a1a1a"
    },
    viewModeContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#9c27b0",
        alignItems: "center",
    },
    viewModeButtonActive: {
        backgroundColor: "#9c27b0",
        borderColor: "#9c27b0",
    },
    viewModeText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#9c27b0",
        textAlign: "center",
    },
    viewModeTextActive: {
        color: "#fff",
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
    deltaCard: {
        backgroundColor: "#f3e5f5",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#9c27b0",
    },
    deltaLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6a1b9a",
        marginBottom: 8,
    },
    deltaInput: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#9c27b0",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 18,
        fontWeight: "600",
        color: "#6a1b9a",
    },
    statsCard: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    statsDividerHorizontal: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 12,
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
    statAtSeaLevel: {
        color: "#ff9800",
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
    typeFilterContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
    },
    typeFilterButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#00bcd4",
        alignItems: "center",
    },
    typeFilterButtonActive: {
        backgroundColor: "#00bcd4",
        borderColor: "#00bcd4",
    },
    typeFilterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#00bcd4",
        textAlign: "center",
    },
    typeFilterTextActive: {
        color: "#fff",
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
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },
    filterButton: {
        flexBasis: "48%",
        flexGrow: 0,
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
    cardAtSeaLevel: {
        backgroundColor: "#fff3e0",
        borderColor: "#ff9800",
        borderWidth: 2,
    },
    cardNoData: {
        backgroundColor: "#f3e5f5",
        borderColor: "#9c27b0",
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
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 8,
    },
    name: { 
        fontSize: 18, 
        fontWeight: "700", 
        flex: 1,
        color: "#1a1a1a",
    },
    speakerButton: {
        backgroundColor: "#2196f3",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    speakerIcon: {
        fontSize: 18,
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
    badgeAtSeaLevel: {
        backgroundColor: "#ff9800",
    },
    badgeSubmerged: {
        backgroundColor: "#f44336",
    },
    badgeNoData: {
        backgroundColor: "#9c27b0",
    },
    badgeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },
    warningBox: {
        marginTop: 12,
        marginBottom: 8,
        padding: 12,
        backgroundColor: "#f3e5f5",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#9c27b0",
    },
    warningText: {
        fontSize: 14,
        color: "#6a1b9a",
        fontWeight: "500",
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
    valueAtSeaLevel: {
        color: "#ff9800",
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