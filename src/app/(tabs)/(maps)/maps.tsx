import geojson from "@/src/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function MapsScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert('Permission denied', 'Location permission is required to show your position');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const initialRegion = {
        latitude: 48.6601895, // Center on first feature from geojson
        longitude: -4.4551801,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true}
            >
                {/* Markers for GeoJSON features */}
                {geojson.features.map((feature, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: feature.geometry.coordinates[1],
                            longitude: feature.geometry.coordinates[0],
                        }}
                        title={feature.properties?.nom || `Point ${index + 1}`}
                        description={`Height: ${feature.properties?.hauteurAuDessusNiveauMer || 'N/A'} m`}
                        pinColor="red"
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: 'red',
        padding: 10,
    }
});