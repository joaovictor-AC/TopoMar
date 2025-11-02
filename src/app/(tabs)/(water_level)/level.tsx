import geojson from "@/assets/geodata/4G6NZVR0_Height_Toponymes.json";
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
// Import FileSystem from Expo
import { Feature } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";


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
                }
                // If the file doesn't exist, state remains 'initial'
            } catch (e) {
                console.error("Failed to load data from file system", e);
                Alert.alert("Erreur", "Impossible de charger les données sauvegardées.");
            } finally {
                setIsLoading(false); // Done loading
            }
        };

        loadData();
    }, [initial]); // 'initial' is stable, so this runs once on mount

    const updateHeight = useCallback((index: number, value: string) => {
        setFeatures((cur) => {
            const next = cur.slice();
            next[index] = {
                ...next[index],
                properties: {
                    ...next[index].properties,
                    hauteurAuDessusNiveauMer: value,
                },
            };
            return next;
        });
    }, []);

    // Function to save data to the file
    const saveAndExport = useCallback(async () => {
        const out = { ...(geojson as any), features };
        try {
            // Stringify the updated GeoJSON structure
            const jsonValue = JSON.stringify(out);
            // Write the string to the file
            await FileSystem.writeAsStringAsync(FILE_URI, jsonValue);
            Alert.alert("Sauvegardé", "Les modifications ont été écrites dans le fichier.");
            console.log("Updated geojson saved to file:", FILE_URI);
        } catch (e) {
            console.error("Failed to save data", e);
            Alert.alert("Erreur", "Impossible de sauvegarder les modifications.");
        }
    }, [features]);

    // Function to reset data to default
    const resetData = useCallback(async () => {
        Alert.alert(
            "Réinitialiser",
            "Voulez-vous vraiment effacer le fichier sauvegardé et revenir aux données par défaut ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Réinitialiser",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Delete the file and reset state
                            await FileSystem.deleteAsync(FILE_URI, { idempotent: true });
                            setFeatures(initial.map((f) => ({ ...f })));
                            Alert.alert("Réinitialisé", "Les données ont été réinitialisées.");
                        } catch (e) {
                            console.error("Failed to reset data", e);
                            Alert.alert("Erreur", "Impossible de réinitialiser les données.");
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
                <Text>Chargement des données...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Water level — éditer hauteur (m)</Text>

            <FlatList
                data={features}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                    const name = item.properties?.nom ?? `#${index + 1}`;
                    const height = item.properties?.hauteurAuDessusNiveauMer ?? "";
                    return (
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <Text style={styles.name}>{name}</Text>
                                <Text style={styles.type}>
                                    {item.properties?.featureType ?? ""}
                                </Text>
                            </View>

                            <View style={[styles.row, { marginTop: 8 }]}>
                                <TextInput
                                    style={styles.input}
                                    value={String(height)}
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        updateHeight(index, text)
                                    }
                                    placeholder="hauteurAuDessusNiveauMer"
                                />
                            </View>
                        </View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                contentContainerStyle={{ paddingBottom: 32 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.action} onPress={saveAndExport}>
                    <Text style={styles.actionText}>Save to File</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.action, styles.actionReset]}
                    onPress={resetData}
                >
                    <Text style={styles.actionText}>Reset to Default</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styles remain exactly the same as the previous version
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    name: { fontSize: 16, fontWeight: "600", flex: 1 },
    type: { fontSize: 12, color: "#666", marginLeft: 8 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: "#fafafa",
    },
    footer: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    action: {
        backgroundColor: "#2d2d2d",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
        alignItems: "center",
    },
    actionReset: {
        backgroundColor: "#c0392b",
    },
    actionText: { color: "#fff", fontWeight: "600" },
});