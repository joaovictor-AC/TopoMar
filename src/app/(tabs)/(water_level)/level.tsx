import geojson from "@/assets/geodata/kerlouan.json";
import LoadingScreen from "@/components/loadingScreen";
import { buttonStyle } from "@/style/button/button_style";
import { cardStyle } from "@/style/card/card_style";
import { footerStyle } from "@/style/footer/footer_style";
import { screenStyle } from "@/style/screen/screen_style";
import { statsStyle } from "@/style/stats/stats_style";
import { textStyle } from "@/style/text/text_style";
import { themeColor } from "@/style/theme";
import { calculateVisibility } from "@/utils/calcHeight";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// Importer votre nouveau hook
import { useDataPersistence } from "@/hooks/useDataPersistence";

export default function WaterLevelScreen() {
    // Appeler le hook pour obtenir toute la logique de persistance et l'état
    const {
        features,
        seaLevel,
        setSeaLevel,
        delta,
        setDelta,
        maxDistance,
        setMaxDistance,
        isLoading,
        saveData,
        resetData
    } = useDataPersistence(geojson);

    // État pour le filtrage de l'interface utilisateur (ce n'est PAS la logique de persistance)
    const [filter, setFilter] = useState<'all' | 'visible' | 'submerged'>('all');
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Afficher un indicateur de chargement pendant la vérification du fichier
    if (isLoading) {
        return <LoadingScreen />;
    }

    // --- La logique de calcul reste dans le composant ---
    const seaLevelValue = parseFloat(seaLevel.replace(',', '.')) || 0;
    const deltaValue = parseFloat(delta.replace(',', '.')) || 0;

    // Calculer les statistiques
    const stats = features.reduce((acc, feature) => {
        // Utiliser hauteurAuDessusNiveauMer du JSON (convertir la chaîne en nombre)
        const alt1 = parseFloat(feature.properties?.altitude || "0");
        const { isVisible } = calculateVisibility(alt1, seaLevelValue, deltaValue);

        if (isVisible) {
            acc.visible++;
        } else {
            acc.submerged++;
        }
        return acc;
    }, { visible: 0, submerged: 0 });

    // Filtrer les fonctionnalités en fonction de la visibilité et de la recherche
    const filteredFeatures = features.filter(feature => {
        // Utiliser hauteurAuDessusNiveauMer du JSON (convertir la chaîne en nombre)
        const alt1 = parseFloat(feature.properties?.altitude || "0");
        const { isVisible } = calculateVisibility(alt1, seaLevelValue, deltaValue);
        const name = feature.properties?.nom?.toLowerCase() || "";

        // Filtrer par visibilité
        if (filter === 'visible' && !isVisible) return false;
        if (filter === 'submerged' && isVisible) return false;

        // Filtrer par requête de recherche
        if (searchQuery && !name.includes(searchQuery.toLowerCase())) return false;

        return true;
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={cardStyle.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                <Text style={screenStyle.title}>Water Level Calculator</Text>


                <View style={cardStyle.seaLevelCard}>
                    {/* Entrée du niveau de la mer (HE) */}
                    <Text style={cardStyle.seaLevelLabel}>Sea Level Height (HE) in meters:</Text>
                    <TextInput
                        style={cardStyle.seaLevelInput}
                        value={seaLevel}
                        keyboardType="numeric"
                        onChangeText={setSeaLevel}
                        placeholder="Enter sea level (e.g., 4.5 or 4,5)"
                    />

                    {/* Entrée du Delta (Δ) */}
                    <Text style={[cardStyle.seaLevelLabel, { marginTop: 12 }]}>Delta (Δ) en mètres :</Text>
                    <TextInput
                        style={cardStyle.seaLevelInput}
                        value={delta}
                        keyboardType="numeric"
                        onChangeText={setDelta}
                        placeholder="Entrez la valeur delta (ex: 0.5)"
                    />

                    {/* Entrée de la distance maximale */}
                    <Text style={[cardStyle.seaLevelLabel, { marginTop: 12 }]}>Distance maximale en mètres :</Text>
                    <TextInput
                        style={cardStyle.seaLevelInput}
                        value={maxDistance}
                        keyboardType="numeric"
                        onChangeText={setMaxDistance}
                        placeholder="Entrez la distance maximale (ex: 1000)"
                    />
                </View>

                {/* Carte des statistiques */}
                <View style={statsStyle.statsCard}>
                    <View style={statsStyle.statItem}>
                        <Text style={statsStyle.statNumber}>{features.length}</Text>
                        <Text style={statsStyle.statLabel}>Total Rochers</Text>
                    </View>
                    <View style={statsStyle.statDivider} />
                    <View style={statsStyle.statItem}>
                        <Text style={[statsStyle.statNumber, statsStyle.visibleText]}>{stats.visible}</Text>
                        <Text style={statsStyle.statLabel}>Visibles</Text>
                    </View>
                    <View style={statsStyle.statDivider} />
                    <View style={statsStyle.statItem}>
                        <Text style={[statsStyle.statNumber, statsStyle.submergedText]}>{stats.submerged}</Text>
                        <Text style={statsStyle.statLabel}>Submergés</Text>
                    </View>
                </View>

                {/* Barre de recherche */}
                <View style={cardStyle.searchContainer}>
                    <TextInput
                        style={cardStyle.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Rechercher des rochers par nom..."
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={buttonStyle.clearButton}
                            onPress={() => setSearchQuery("")}
                        >
                            <Text style={buttonStyle.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Boutons de filtre */}
                <View style={buttonStyle.filterContainer}>
                    <TouchableOpacity
                        style={[buttonStyle.filterButton, filter === 'all' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[textStyle.filterText, filter === 'all' && textStyle.filterTextActive]}>
                            Tous ({features.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[buttonStyle.filterButton, filter === 'visible' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('visible')}
                    >
                        <Text style={[textStyle.filterText, filter === 'visible' && textStyle.filterTextActive]}>
                            Visibles ({stats.visible})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[buttonStyle.filterButton, filter === 'submerged' && buttonStyle.filterButtonActive]}
                        onPress={() => setFilter('submerged')}
                    >
                        <Text style={[textStyle.filterText, filter === 'submerged' && textStyle.filterTextActive]}>
                            Submergés ({stats.submerged})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Nombre de résultats */}
                <Text style={textStyle.resultsText}>
                    Affichage de {filteredFeatures.length} rocher{filteredFeatures.length !== 1 ? 's' : ''}
                    {searchQuery && ` correspondant à "${searchQuery}"`}
                </Text>

                {/* Liste des rochers */}
                {filteredFeatures.map((item, index) => {
                    const name = item.properties?.nom ?? `#${index + 1}`;
                    // Utiliser hauteurAuDessusNiveauMer du JSON (convertir la chaîne en nombre)
                    const alt1 = parseFloat(item.properties?.altitude || "0");
                    const alt2 = item.properties?.alt2;

                    // Calculer la visibilité
                    const { isVisible, visibilityHeight } = calculateVisibility(alt1, seaLevelValue, deltaValue);

                    return (
                        <View
                            key={index}
                            style={[
                                cardStyle.card,
                                !isVisible && cardStyle.cardSubmerged,
                                index < filteredFeatures.length - 1 && cardStyle.cardMarginBottom
                            ]}
                        >
                            <View style={cardStyle.row}>
                                <Text style={cardStyle.name}>{name}</Text>
                                <View style={[
                                    cardStyle.visibilityBadge,
                                    isVisible ? themeColor.visibleTheme : themeColor.submergedTheme
                                ]}>
                                    <Text style={cardStyle.badgeText}>
                                        {isVisible ? "VISIBLE" : "SUBMERGÉ"}
                                    </Text>
                                </View>
                            </View>

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Hauteur au-dessus du niveau de la mer :</Text>
                                <Text style={cardStyle.value}>
                                    {alt1 !== null && !isNaN(alt1) ? `${alt1} m` : "N/A"}
                                </Text>
                            </View>

                            {alt2 !== null && alt2 !== undefined && (
                                <View style={cardStyle.dataRow}>
                                    <Text style={cardStyle.label}>Alt2 :</Text>
                                    <Text style={cardStyle.value}>{alt2} m</Text>
                                </View>
                            )}

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Niveau de la mer (HE) :</Text>
                                <Text style={cardStyle.value}>{seaLevelValue.toFixed(2)} m</Text>
                            </View>

                            <View style={cardStyle.dataRow}>
                                <Text style={cardStyle.label}>Delta (Δ) :</Text>
                                <Text style={cardStyle.value}>{deltaValue.toFixed(2)} m</Text>
                            </View>

                            <View style={cardStyle.infoBox}>
                                <Text style={cardStyle.infoText}>
                                    {isVisible
                                        ? `✅ Le rocher est à ${visibilityHeight?.toFixed(2)}m au-dessus de l'eau`
                                        : `❌ Le rocher est à ${Math.abs(visibilityHeight || 0).toFixed(2)}m sous l'eau`
                                    }
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Section pied de page - Fixée en bas */}
            <View style={footerStyle.footer}>
                <TouchableOpacity style={buttonStyle.action} onPress={saveData}>
                    <Text style={buttonStyle.actionText}>Sauvegarder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[buttonStyle.action, buttonStyle.actionReset]}
                    onPress={resetData}
                >
                    <Text style={buttonStyle.actionText}>Réinitialiser</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}