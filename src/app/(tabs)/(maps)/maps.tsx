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

// MapsScreen : affiche une carte centrée sur une région et rend des marqueurs à partir d'un fichier GeoJSON.
export default function MapsScreen() {
    const markerRefs = useRef<any[]>([]);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Lire le niveau de la mer et le delta persistants pour que le modal affiche la visibilité réelle
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

    // Visibilité du modal et fonctionnalité sélectionnée gérées ci-dessous via FeatureModal

    return (
        // Le conteneur enveloppe la MapView pour remplir l'écran
        <View style={{ flex: 1 }}>

            {/* MapView : fournisseur défini sur Google, commence à initialRegion et affiche la position de l'appareil */}
            <MapView
                key={firstFeature ? `${firstFeature.geometry.coordinates[0]}-${firstFeature.geometry.coordinates[1]}` : 'default'}
                style={screenStyle.background}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation={true} // Afficher le point bleu pour la position actuelle de l'utilisateur (nécessite des permissions)
            >
                {/* Rendre un marqueur pour chaque fonctionnalité GeoJSON */}
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
                                // Les coordonnées GeoJSON sont [longitude, latitude]
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