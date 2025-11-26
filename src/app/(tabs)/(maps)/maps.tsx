import geojson from "@/assets/geodata/kerlouan.json";
import FeatureModal from '@/components/FeatureModal';
import { PIN_COLOR } from "@/constants/colors";
import { INITIAL_REGION } from "@/constants/maps_region";
import { useDataPersistence } from "@/hooks/useDataPersistence";
import { screenStyle } from "@/style/screen/screen_style";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// MapsScreen: shows a map centered on a region and renders markers from a GeoJSON file.
export default function MapsScreen() {

    const markerRefs = useRef<any[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Read persisted sea level and delta so modal shows real visibility
    const { seaLevel, delta } = useDataPersistence(geojson);
    const seaLevelValue = parseFloat(String(seaLevel).replace(',', '.')) || 0;
    const deltaValue = parseFloat(String(delta).replace(',', '.')) || 0;

    // modal visibility and selectedFeature handled below via FeatureModal

    return (
        // container wraps the MapView to fill the screen
        <View style={{ flex: 1 }}>

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
                        ref={(ref) => { markerRefs.current[index] = ref; }}
                        onPress={() => {
                            markerRefs.current[index]?.showCallout();
                            setSelectedFeature(feature);
                            setModalVisible(true);
                        }}
                        coordinate={{
                            // GeoJSON coordinates are [longitude, latitude]
                            latitude: feature.geometry.coordinates[1],
                            longitude: feature.geometry.coordinates[0],
                        }}
                        pinColor={PIN_COLOR}
                    >
                    </Marker>
                ))}
            </MapView>

            <FeatureModal
                visible={modalVisible}
                feature={selectedFeature}
                seaLevel={seaLevelValue}
                delta={deltaValue}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedFeature(null);
                }}
            />
        </View>
    );
}