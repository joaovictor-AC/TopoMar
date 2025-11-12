import geojson from "@/src/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// MapsScreen: shows a map centered on a region and renders markers from a GeoJSON file.
export default function MapsScreen() {

    // initialRegion: map center and zoom (latitudeDelta/longitudeDelta control zoom level)
    const initialRegion = {
        latitude: 48.65870936500545, // center latitude
        longitude: -4.436788867429383, // center longitude
        latitudeDelta: 0.09,
        longitudeDelta: 0.05,
    };

    return (
        // container wraps the MapView to fill the screen
        <View style={styles.container}>

            {/* MapView: provider set to Google, starts at initialRegion and shows device location */}
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true} // show blue dot for user's current position (requires permissions)
            >
                {/* Render a Marker for each GeoJSON feature */}
                {geojson.features.map((feature, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            // GeoJSON coordinates are [longitude, latitude]
                            latitude: feature.geometry.coordinates[1],
                            longitude: feature.geometry.coordinates[0],
                        }}
                        // title shown in native callout; uses "nom" property if available
                        title={feature.properties?.nom || `Point ${index + 1}`}
                        // description shown in native callout; display height when present
                        description={`Height: ${feature.properties?.hauteurAuDessusNiveauMer || 'N/A'} m`}
                        
                    />
                ))}
            </MapView>
        </View>
    );
}

// Styles: keep the map full-screen and container flexible
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