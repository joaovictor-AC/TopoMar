import geojson from "@/assets/geodata/4G6NZVR0_Height_Toponymes.json";
import { INITIAL_REGION } from "@/constants/maps_region";
import { screenStyle } from "@/style/screen/screen_style";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// MapsScreen: shows a map centered on a region and renders markers from a GeoJSON file.
export default function MapsScreen() {

    return (
        // container wraps the MapView to fill the screen
        <View style={{flex: 1}}>

            {/* MapView: provider set to Google, starts at initialRegion and shows device location */}
            <MapView
                style={screenStyle.background}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
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