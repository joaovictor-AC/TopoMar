import geojson from "@/assets/geodata/kerlouan.json";
import FeatureModal from '@/components/FeatureModal';
import LoadingScreen from "@/components/loadingScreen";
import ReturnButton from '@/components/ReturnButton';
import { SUBMERGED, VISIBLE } from "@/constants/colors";
import { INITIAL_REGION } from "@/constants/maps_region";
import { useDataPersistence } from "@/hooks/useDataPersistence";
import { screenStyle } from "@/style/screen/screen_style";
import { calculateVisibility } from "@/utils/calcHeight";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// MapsScreen: shows a map centered on a region and renders markers from a GeoJSON file.
export default function MapsScreen() {
    const markerRefs = useRef<any[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Read persisted sea level and delta so modal shows real visibility
    const { features, seaLevel, delta, isLoading } = useDataPersistence(geojson);
    const seaLevelValue = parseFloat(String(seaLevel).replace(',', '.')) || 0;
    const deltaValue = parseFloat(String(delta).replace(',', '.')) || 0;

    if (isLoading) {
        return <LoadingScreen />;
    }

    const firstFeature = features[0];
    const initialRegion = firstFeature ? {
        latitude: firstFeature.geometry.coordinates[1],
        longitude: firstFeature.geometry.coordinates[0],
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
    } : INITIAL_REGION;

    // modal visibility and selectedFeature handled below via FeatureModal

    return (
        // container wraps the MapView to fill the screen
        <View style={{ flex: 1 }}>

            {/* MapView: provider set to Google, starts at initialRegion and shows device location */}
            <MapView
                key={firstFeature ? `${firstFeature.geometry.coordinates[0]}-${firstFeature.geometry.coordinates[1]}` : 'default'}
                style={screenStyle.background}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true} // show blue dot for user's current position (requires permissions)
            >
                {/* Render a Marker for each GeoJSON feature */}
                {features.map((feature, index) => {
                    const alt = parseFloat(feature?.properties?.altitude || '0');
                    const { isVisible } = calculateVisibility(alt, seaLevelValue, deltaValue);

                    return (
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
                            pinColor={isVisible ? VISIBLE : SUBMERGED}
                        >
                        </Marker>
                    )
                })}
            </MapView>

            <ReturnButton />

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