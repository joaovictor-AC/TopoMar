// @/hooks/useGeoDataPersistence.ts

import { Feature } from "@/types/locationTypes";
import * as FileSystem from "expo-file-system/legacy";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Custom hook to manage data persistence for geojson features,
 * sea level height (HE), and delta values using Expo FileSystem.
 * 
 * @param {Feature[]} initialFeatures - The initial array of geojson features.
 * @param {object} geojson - The original geojson object to merge with saved data.
 * @returns An object containing state variables and functions for data management.
 */
export const useDataPersistence = (initialFeatures: Feature[], geojson: object) => {

    // Define a file URI in the app's persistent document directory
    const FILE_URI = FileSystem.documentDirectory + "myGeoData.json";
    // Keep the original data as a fallback
    const initial = initialFeatures.map((f) => ({ ...f }));

    // Set initial state from the file, it will be updated from storage
    const [features, setFeatures] = useState<Feature[]>(initial);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for sea level height (HE)
    const [seaLevel, setSeaLevel] = useState<string>("8.0");
    
    // State for delta
    const [delta, setDelta] = useState<string>("4.5");

    // Load saved data when the hook is first used
    useEffect(() => {
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
                }
            } catch (e) {
                console.error("Failed to load data from file system", e);
                Alert.alert("Error", "Unable to load saved data.");
            } finally {
                setIsLoading(false); // Done loading
            }
        };

        loadData();
    }, []); // Empty array ensures this runs once on mount

    // Function to save data (this is your 'saveAndExport')
    const saveData = useCallback(async () => {
        const out = { 
            ...(geojson as any), 
            features,
            seaLevel: parseFloat(seaLevel.replace(',', '.')) || 0,
            delta: parseFloat(delta.replace(',', '.')) || 0
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
                            await FileSystem.deleteAsync(FILE_URI, { idempotent: true });
                            setFeatures(initial); // Reset to the initial map
                            setSeaLevel("0");
                            setDelta("0");
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

    // Return all the state and functions the component needs
    return {
        features,
        setFeatures, // Return setFeatures if you modify it (e.g., editing a rock)
        seaLevel,
        setSeaLevel,
        delta,
        setDelta,
        isLoading,
        saveData, 
        resetData
    };
}