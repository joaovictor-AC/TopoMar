// @/screens/WaterLevelScreen.tsx

import geojson from "@/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import LoadingScreen from "@/components/loadingScreen";
import { buttonStyle } from "@/style/button/button_style";
import { cardStyle } from "@/style/card/card_style";
import { footerStyle } from "@/style/footer/footer_style";
import { screenStyle } from "@/style/screen/screen_style";
import { statsStyle } from "@/style/stats/stats_style";
import { textStyle } from "@/style/text/text_style";
import { themeColor } from "@/style/theme";
import { Feature } from "@/types/locationTypes";
import { calculateVisibility } from "@/utils/calcHeight";
import React, { useState } from "react"; // Removed useEffect, useCallback
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// Import your new hook
import { useDataPersistence } from "@/hooks/useDataPersistence";

// Keep the original data as a fallback - load it ONCE
const initial = (geojson as any).features as Feature[] || [];

export default function WaterLevelScreen() {
    // Call the hook to get all persistence logic and state
    const {
        features,
        seaLevel,
        setSeaLevel,
        delta,
        setDelta,
        isLoading,
        saveData,    // Renamed from saveAndExport
        resetData
    } = useDataPersistence(initial, geojson);
    
    // State for UI filtering (this is NOT persistence logic)
    const [filter, setFilter] = useState<'all' | 'visible' | 'submerged'>('all');
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Show a loading indicator while checking for the file
    if (isLoading) {
        return <LoadingScreen />;
    }

    // --- Calculation logic remains in the component ---
    const seaLevelValue = parseFloat(seaLevel.replace(',', '.')) || 0;
    const deltaValue = parseFloat(delta.replace(',', '.')) || 0;
    const effectiveSeaLevel = seaLevelValue + deltaValue;

    // Calculate statistics
    const stats = features.reduce((acc, feature) => {
        // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
        const alt1 = parseFloat(feature.properties?.hauteurAuDessusNiveauMer || "0");
        const { isVisible } = calculateVisibility(alt1, effectiveSeaLevel);
        
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
        const { isVisible } = calculateVisibility(alt1, effectiveSeaLevel);
        const name = feature.properties?.nom?.toLowerCase() || "";
        
        // Filter by visibility
        if (filter === 'visible' && !isVisible) return false;
        if (filter === 'submerged' && isVisible) return false;
        
        // Filter by search query
        if (searchQuery && !name.includes(searchQuery.toLowerCase())) return false;
        
        return true;
    });

    return (
        <View style={{flex: 1}}>
            <ScrollView 
                style={{flex: 1}}
                contentContainerStyle={cardStyle.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                <Text style={screenStyle.title}>Water Level Calculator</Text>
                
                
                <View style={cardStyle.seaLevelCard}>
                    {/* Sea Level Input (HE) */}
                    <Text style={cardStyle.seaLevelLabel}>Sea Level Height (HE) in meters:</Text>
                    <TextInput
                        style={cardStyle.seaLevelInput}
                        value={seaLevel}
                        keyboardType="numeric"
                        onChangeText={setSeaLevel}
                        placeholder="Enter sea level (e.g., 4.5 or 4,5)"
                    />
                    
                    {/* Delta Input (Δ)*/}
                    <Text style={[cardStyle.seaLevelLabel, { marginTop: 12 }]}>Delta (Δ) in meters:</Text>
                    <TextInput
                        style={cardStyle.seaLevelInput}
                        value={delta}
                        keyboardType="numeric"
                        onChangeText={setDelta}
                        placeholder="Enter delta value (e.g., 0.5)"
                    />
                </View>

                {/* Statistics Card */}
                <View style={statsStyle.statsCard}>
                    <View style={statsStyle.statItem}>
                        <Text style={statsStyle.statNumber}>{features.length}</Text>
                        <Text style={statsStyle.statLabel}>Total Rocks</Text>
                    </View>
                    <View style={statsStyle.statDivider} />
                    <View style={statsStyle.statItem}>
                        <Text style={[statsStyle.statNumber, statsStyle.visibleText]}>{stats.visible}</Text>
                        <Text style={statsStyle.statLabel}>Visible</Text>
                    </View>
                    <View style={statsStyle.statDivider} />
                    <View style={statsStyle.statItem}>
                        <Text style={[statsStyle.statNumber, statsStyle.submergedText]}>{stats.submerged}</Text>
                        <Text style={statsStyle.statLabel}>Submerged</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={cardStyle.searchContainer}>
                    <TextInput
                        style={cardStyle.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search rocks by name..."
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity 
                            style={buttonStyle.clearButton}
                            onPress={() => setSearchQuery("")}
                        >
                            <Text style={buttonStyle.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Buttons */}
                <View style={buttonStyle.filterContainer}>
                    <TouchableOpacity 
                        style={[buttonStyle.filterButton, filter === 'all' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[textStyle.filterText, filter === 'all' && textStyle.filterTextActive]}>
                            All ({features.length})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[buttonStyle.filterButton, filter === 'visible' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('visible')}
                    >
                        <Text style={[textStyle.filterText, filter === 'visible' && textStyle.filterTextActive]}>
                            🟢 Visible ({stats.visible})
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[buttonStyle.filterButton, filter === 'submerged' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('submerged')}
                    >
                        <Text style={[textStyle.filterText, filter === 'submerged' && textStyle.filterTextActive]}>
                            🔴 Submerged ({stats.submerged})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Results count */}
                <Text style={textStyle.resultsText}>
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
                    const { isVisible, visibilityHeight } = calculateVisibility(alt1, effectiveSeaLevel);
                    
                    return (
                        <View 
                            key={index}
                            style={[
                                cardStyle.card,
                                !isVisible && cardStyle.cardSubmerged,
                                index < filteredFeatures.length - 1 && cardStyle.cardMarginBottom
                            ]}
                        >
                            <View style={cardStyle.row}>
                                <Text style={cardStyle.name}>{name}</Text>
                                <View style={[
                                    cardStyle.visibilityBadge,
                                    isVisible ? themeColor.visibleTheme : themeColor.submergedTheme
                                ]}>
                                    <Text style={cardStyle.badgeText}>
                                        {isVisible ? "VISIBLE" : "SUBMERGED"}
                                    </Text>
                                </View>
                            </View>

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Height above sea level:</Text>
                                <Text style={cardStyle.value}>
                                    {alt1 !== null && !isNaN(alt1) ? `${alt1} m` : "N/A"}
                                </Text>
                            </View>

                            {alt2 !== null && alt2 !== undefined && (
                                <View style={cardStyle.dataRow}>
                                    <Text style={cardStyle.label}>Alt2:</Text>
                                    <Text style={cardStyle.value}>{alt2} m</Text>
Next, I'd like to show the `effectiveSeaLevel` in the `Sea Level Input` card. Can you show me how to do that?                                </View>
                            )}

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Sea Level (HE):</Text>
                                <Text style={cardStyle.value}>{seaLevelValue.toFixed(2)} m</Text>
                            </View>

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Delta (Δ):</Text>
                                <Text style={cardStyle.value}>{deltaValue.toFixed(2)} m</Text>
                            </View>

                            {visibilityHeight !== null && (
                                <View style={cardStyle.dataRow}>
                                    <Text style={[cardStyle.label, cardStyle.labelBold]}>
                                        Visibility (Height - HE):
                                    </Text>
                                    <Text style={[
                                        cardStyle.value,
                                        cardStyle.valueBold,
                                        visibilityHeight < 0 ? statsStyle.submergedText : statsStyle.visibleText
                                    ]}>
                                        {visibilityHeight.toFixed(2)} m
                                    </Text>
                                </View>
                            )}

                            <View style={cardStyle.infoBox}>
                                <Text style={cardStyle.infoText}>
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
            <View style={footerStyle.footer}>
                <TouchableOpacity style={buttonStyle.action} onPress={saveData}>
                    <Text style={buttonStyle.actionText}>Save Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[buttonStyle.action, buttonStyle.actionSecondary]}
                    onPress={() => {
                        // Export visible rocks list
                        const visibleRocks = features
                            .filter(f => {
                                // Use hauteurAuDessusNiveauMer from JSON (convert string to number)
                                const alt1 = parseFloat(f.properties?.hauteurAuDessusNiveauMer || "0");
                                const { isVisible } = calculateVisibility(alt1, effectiveSeaLevel);
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
                    <Text style={buttonStyle.actionText}>Export Visible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[buttonStyle.action, buttonStyle.actionReset]}
                    onPress={resetData}
                >
                    <Text style={buttonStyle.actionText}>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}