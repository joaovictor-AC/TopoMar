// @/hooks/useGeoDataPersistence.ts

import { Feature, FeatureCollection } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

/**
 * Custom hook to manage data persistence for geojson features,
 * sea level height (HE), and delta values using Expo FileSystem.
 * 
 * @param {Feature[]} initialFeatures - The initial array of geojson features.
 * @param {object} geojson - The original geojson object to merge with saved data.
 * @returns An object containing state variables and functions for data management.
 */
export const useDataPersistence = (geojson: FeatureCollection) => {

    // Define a file URI in the app's persistent document directory
    const FILE_URI = FileSystem.documentDirectory + "myGeoData.json";
    const initialFeatures = geojson.features as Feature[] || [];

    // Keep the original data as a fallback
    const initial = initialFeatures.map((f) => ({ ...f }));

    // Set initial state from the file, it will be updated from storage
    const [features, setFeatures] = useState<Feature[]>(initial);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for sea level height (HE)
    const [seaLevel, setSeaLevel] = useState<string>("8.0");
    
    // State for delta
    const [delta, setDelta] = useState<string>(geojson.deltaReference || "4.5");

    // State for max distance
    const [maxDistance, setMaxDistance] = useState<string>(geojson.maxDistanceReference || "1000");

    // State for references (to support resetting to imported defaults)
    const [deltaReference, setDeltaReference] = useState<string>(geojson.deltaReference || "4.5");
    const [maxDistanceReference, setMaxDistanceReference] = useState<string>(geojson.maxDistanceReference || "1000");

    // Load saved data when the screen comes into focus
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
                        // Load references if they exist
                        if (savedData.deltaReference !== undefined) {
                            setDeltaReference(String(savedData.deltaReference));
                        }
                        if (savedData.maxDistanceReference !== undefined) {
                            setMaxDistanceReference(String(savedData.maxDistanceReference));
                        }
                    }
                } catch (e) {
                    console.error("Failed to load data from file system", e);
                    Alert.alert("Error", "Unable to load saved data.");
                } finally {
                    setIsLoading(false); // Done loading
                }
            };

            loadData();
        }, [])
    );

    // Function to save data (this is your 'saveAndExport')
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
            Alert.alert("Saved", "Changes have been written to the file.");
            console.log("Updated geojson saved to file:", FILE_URI);
        } catch (e) {
            console.error("Failed to save data", e);
            Alert.alert("Error", "Unable to save changes.");
        }
    }, [features, seaLevel, delta, maxDistance, deltaReference, maxDistanceReference]);

    // Function to reset data to default
    const resetData = useCallback(async () => {
        Alert.alert(
            "Reset",
            "Do you want to reset values to defaults?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            // Reset state to references
                            setSeaLevel("8.0");
                            setDelta(deltaReference);
                            setMaxDistance(maxDistanceReference);
                            
                            // Save immediately with reset values
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

                            Alert.alert("Reset", "Values have been reset to defaults.");
                        } catch (e) {
                            console.error("Failed to reset data", e);
                            Alert.alert("Error", "Unable to reset data.");
                        }
                    },
                },
            ]
        );
    }, [initial, deltaReference, maxDistanceReference, features]);

    // Return all the state and functions the component needs
    return {
        features,
        setFeatures, // Return setFeatures if you modify it (e.g., editing a rock)
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