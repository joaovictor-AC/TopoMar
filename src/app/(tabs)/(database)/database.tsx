import geojson from "@/assets/geodata/kerlouan.json";
import { useDataPersistence } from "@/hooks/useDataPersistence";
import { buttonStyle } from "@/style/button/button_style";
import { cardStyle } from "@/style/card/card_style";
import { screenStyle } from "@/style/screen/screen_style";
import { textStyle } from "@/style/text/text_style";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DatabaseScreen() {
    const {
        features,
        seaLevel,
        delta,
        maxDistance,
        setFeatures,
        setDelta,
        setMaxDistance,
        setDeltaReference,
        setMaxDistanceReference,
        saveData,
        resetData
    } = useDataPersistence(geojson);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true
            });

            if (result.canceled) {
                return;
            }

            const fileUri = result.assets[0].uri;
            const fileContent = await FileSystem.readAsStringAsync(fileUri);
            
            try {
                const json = JSON.parse(fileContent);
                
                // Basic validation
                if (!json.features || !Array.isArray(json.features)) {
                    Alert.alert("Error", "Invalid JSON: 'features' array is missing.");
                    return;
                }

                // Update state
                setFeatures(json.features);
                
                if (json.deltaReference) {
                    setDelta(String(json.deltaReference));
                    setDeltaReference(String(json.deltaReference));
                }
                
                if (json.maxDistanceReference) {
                    setMaxDistance(String(json.maxDistanceReference));
                    setMaxDistanceReference(String(json.maxDistanceReference));
                }
                
                Alert.alert("Success", "JSON loaded! Please click 'Save Changes' to persist this data.");

            } catch (e) {
                Alert.alert("Error", "Failed to parse JSON.");
            }

        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to pick file.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={screenStyle.background} contentContainerStyle={{ padding: 20, gap: 20 }}>
                <Text style={screenStyle.title}>Database Management</Text>

                <View style={cardStyle.seaLevelCard}>
                    <Text style={cardStyle.seaLevelLabel}>Current Data Status</Text>
                    <View style={{ marginTop: 10, gap: 5, marginBottom: 15 }}>
                        <Text style={textStyle.filterText}>• Total Features: {features.length}</Text>
                    </View>

                    <Text style={[cardStyle.seaLevelLabel, { fontSize: 16, marginBottom: 10 }]}>Features List</Text>
                    <View style={{ maxHeight: 300, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
                        <ScrollView nestedScrollEnabled style={{ padding: 5 }}>
                            {features.map((item, index) => (
                                <View key={index} style={{ 
                                    flexDirection: 'row', 
                                    paddingVertical: 8, 
                                    paddingHorizontal: 5,
                                    borderBottomWidth: index === features.length - 1 ? 0 : 1, 
                                    borderBottomColor: 'rgba(0,0,0,0.1)',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text style={[textStyle.filterText, { flex: 2, fontSize: 14 }]} numberOfLines={1}>
                                        {index + 1}. {item.properties.nom || 'Unnamed'}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={{ gap: 15 }}>
                    <TouchableOpacity style={buttonStyle.action} onPress={pickDocument}>
                        <Text style={buttonStyle.actionText}>Import JSON File</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={buttonStyle.action} onPress={saveData}>
                        <Text style={buttonStyle.actionText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[buttonStyle.action, buttonStyle.actionReset]} onPress={resetData}>
                        <Text style={buttonStyle.actionText}>Reset to Default</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
