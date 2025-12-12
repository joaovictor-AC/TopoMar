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
                
                // Validation de base
                if (!json.features || !Array.isArray(json.features)) {
                    Alert.alert("Erreur", "JSON invalide : le tableau 'features' est manquant.");
                    return;
                }

                // Mettre à jour l'état
                setFeatures(json.features);
                
                if (json.deltaReference) {
                    setDelta(String(json.deltaReference));
                    setDeltaReference(String(json.deltaReference));
                }
                
                if (json.maxDistanceReference) {
                    setMaxDistance(String(json.maxDistanceReference));
                    setMaxDistanceReference(String(json.maxDistanceReference));
                }
                
                Alert.alert("Succès", "JSON chargé ! Veuillez cliquer sur 'Sauvegarder les modifications' pour conserver ces données.");

            } catch (e) {
                Alert.alert("Erreur", "Échec de l'analyse du JSON.");
            }

        } catch (err) {
            console.error(err);
            Alert.alert("Erreur", "Échec de la sélection du fichier.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={screenStyle.background} contentContainerStyle={{ padding: 20, gap: 20 }}>
                <Text style={screenStyle.title}>Gestion de la base de données</Text>

                <View style={cardStyle.seaLevelCard}>
                    <Text style={cardStyle.seaLevelLabel}>État actuel des données</Text>
                    <View style={{ marginTop: 10, gap: 5, marginBottom: 15 }}>
                        <Text style={textStyle.filterText}>• Total des éléments : {features.length}</Text>
                    </View>

                    <Text style={[cardStyle.seaLevelLabel, { fontSize: 16, marginBottom: 10 }]}>Liste des éléments</Text>
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
                                        {index + 1}. {item.properties.nom || 'Sans nom'}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                <View style={{ gap: 15 }}>
                    <TouchableOpacity style={buttonStyle.action} onPress={pickDocument}>
                        <Text style={buttonStyle.actionText}>Importer un fichier JSON</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={buttonStyle.action} onPress={saveData}>
                        <Text style={buttonStyle.actionText}>Sauvegarder les modifications</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[buttonStyle.action, buttonStyle.actionReset]} onPress={resetData}>
                        <Text style={buttonStyle.actionText}>Réinitialiser par défaut</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}
