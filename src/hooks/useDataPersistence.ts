// @/hooks/useGeoDataPersistence.ts

import { Feature, FeatureCollection } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

/**
 * Hook personnalisé pour gérer la persistance des données pour les fonctionnalités geojson,
 * la hauteur du niveau de la mer (HE) et les valeurs delta en utilisant Expo FileSystem.
 * 
 * @param {Feature[]} initialFeatures - Le tableau initial des fonctionnalités geojson.
 * @param {object} geojson - L'objet geojson original à fusionner avec les données sauvegardées.
 * @returns Un objet contenant les variables d'état et les fonctions de gestion des données.
 */
export const useDataPersistence = (geojson: FeatureCollection) => {

    // Définit un URI de fichier dans le répertoire de documents persistants de l'application
    const FILE_URI = FileSystem.documentDirectory + "myGeoData.json";
    const initialFeatures = geojson.features as Feature[] || [];

    // Conserve les données originales comme solution de repli
    const initial = initialFeatures.map((f) => ({ ...f }));

    // Définit l'état initial à partir du fichier, il sera mis à jour depuis le stockage
    const [features, setFeatures] = useState<Feature[]>(initial);
    const [isLoading, setIsLoading] = useState(true);
    
    // État pour la hauteur du niveau de la mer (HE)
    const [seaLevel, setSeaLevel] = useState<string>("8.0");
    
    // État pour le delta
    const [delta, setDelta] = useState<string>(geojson.deltaReference || "4.5");

    // État pour la distance maximale
    const [maxDistance, setMaxDistance] = useState<string>(geojson.maxDistanceReference || "1000");

    // État pour les références (pour supporter la réinitialisation aux valeurs par défaut importées)
    const [deltaReference, setDeltaReference] = useState<string>(geojson.deltaReference || "4.5");
    const [maxDistanceReference, setMaxDistanceReference] = useState<string>(geojson.maxDistanceReference || "1000");

    // Charge les données sauvegardées lorsque l'écran devient actif
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const fileInfo = await FileSystem.getInfoAsync(FILE_URI);
                    if (fileInfo.exists) {
                        const fileContents = await FileSystem.readAsStringAsync(FILE_URI);
                        const savedData = JSON.parse(fileContents);
                        
                        if (savedData.features) {
                            setFeatures(savedData.features as Feature[]);
                        }
                        if (savedData.seaLevel !== undefined) {
                            setSeaLevel(String(savedData.seaLevel));
                        }
                        if (savedData.delta !== undefined) {
                            setDelta(String(savedData.delta));
                        }
                        if (savedData.maxDistance !== undefined) {
                            setMaxDistance(String(savedData.maxDistance));
                        }
                        // Charge les références si elles existent
                        if (savedData.deltaReference !== undefined) {
                            setDeltaReference(String(savedData.deltaReference));
                        }
                        if (savedData.maxDistanceReference !== undefined) {
                            setMaxDistanceReference(String(savedData.maxDistanceReference));
                        }
                    }
                } catch (e) {
                    console.error("Failed to load data from file system", e);
                    Alert.alert("Erreur", "Impossible de charger les données sauvegardées.");
                } finally {
                    setIsLoading(false); // Chargement terminé
                }
            };

            loadData();
        }, [])
    );

    // Fonction pour sauvegarder les données (c'est votre 'saveAndExport')
    const saveData = useCallback(async () => {
        const out = { 
            ...(geojson as any), 
            features,
            seaLevel: parseFloat(seaLevel.replace(',', '.')) || 0,
            delta: parseFloat(delta.replace(',', '.')) || 0,
            maxDistance: parseFloat(maxDistance.replace(',', '.')) || 0,
            deltaReference: parseFloat(deltaReference.replace(',', '.')) || 0,
            maxDistanceReference: parseFloat(maxDistanceReference.replace(',', '.')) || 0
        };
        try {
            const jsonValue = JSON.stringify(out);
            await FileSystem.writeAsStringAsync(FILE_URI, jsonValue);
            Alert.alert("Sauvegardé", "Les modifications ont été enregistrées dans le fichier.");
            console.log("Updated geojson saved to file:", FILE_URI);
        } catch (e) {
            console.error("Failed to save data", e);
            Alert.alert("Erreur", "Impossible d'enregistrer les modifications.");
        }
    }, [features, seaLevel, delta, maxDistance, deltaReference, maxDistanceReference]);

    // Fonction pour réinitialiser les données aux valeurs par défaut
    const resetData = useCallback(async () => {
        Alert.alert(
            "Réinitialiser",
            "Voulez-vous réinitialiser les valeurs par défaut ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui",
                    onPress: async () => {
                        try {
                            // Réinitialiser l'état aux références
                            setSeaLevel("8.0");
                            setDelta(deltaReference);
                            setMaxDistance(maxDistanceReference);
                            
                            // Sauvegarder immédiatement avec les valeurs réinitialisées
                            const out = { 
                                ...(geojson as any), 
                                features,
                                seaLevel: 8.0,
                                delta: parseFloat(deltaReference.replace(',', '.')) || 0,
                                maxDistance: parseFloat(maxDistanceReference.replace(',', '.')) || 0,
                                deltaReference: parseFloat(deltaReference.replace(',', '.')) || 0,
                                maxDistanceReference: parseFloat(maxDistanceReference.replace(',', '.')) || 0
                            };
                            const jsonValue = JSON.stringify(out);
                            await FileSystem.writeAsStringAsync(FILE_URI, jsonValue);

                            Alert.alert("Réinitialisé", "Les valeurs ont été réinitialisées par défaut.");
                        } catch (e) {
                            console.error("Failed to reset data", e);
                            Alert.alert("Erreur", "Impossible de réinitialiser les données.");
                        }
                    },
                },
            ]
        );
    }, [deltaReference, maxDistanceReference, features]);

    // Retourne tout l'état et les fonctions dont le composant a besoin
    return {
        features,
        setFeatures, // Retourne setFeatures si vous le modifiez (par exemple, modification d'un rocher)
        seaLevel,
        setSeaLevel,
        delta,
        setDelta,
        maxDistance,
        setMaxDistance,
        setDeltaReference,
        setMaxDistanceReference,
        isLoading,
        saveData, 
        resetData
    };
}