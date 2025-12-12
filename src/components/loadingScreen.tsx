import { screenStyle } from "@/style/screen/screen_style";
import { Text, View } from "react-native";

export default function LoadingScreen() {
    return (
        <View style={[screenStyle.container, { backgroundColor: "#f7f7f7" }]}>
            <Text>Chargement des données...</Text>
        </View>
    );
}