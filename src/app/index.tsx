// Importer la navigation et les composants principaux de React Native
import { buttonStyle } from "@/style/button/button_style";
import { iconStyle } from "@/style/icon/icon_style";
import { screenStyle } from "@/style/screen/screen_style";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { Image, ImageBackground, StatusBar, TouchableOpacity, View } from "react-native";

// --- Actifs ---
// Charger toutes les images requises localement. 'require' assure qu'elles sont empaquetées avec l'application.
const OCAEN_BACKGROUN = require('../assets/images/home_screen.png');
const MAP_PIN_ICON = require('../assets/images/map_pin.png');
const CAMERA_ICON = require('../assets/images/camera.png');
const WAVES_ICON = require('../assets/images/vector.png');

/**
 * Composant principal de l'écran d'accueil (route Index).
 * Affiche les boutons de navigation sur une image de fond.
 */
export default function Index() {
  // Le hook 'useRouter' fournit les fonctions de navigation.
  const router = useRouter();

  return (
    <ImageBackground
      source={OCAEN_BACKGROUN}
      style={screenStyle.background}
      resizeMode="cover"
    >
      <View style={screenStyle.container}>
        <View style={buttonStyle.buttonContainer}>

          {/* Bouton de navigation Carte */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/maps")} // Naviguer vers l'écran /maps lors de l'appui
            activeOpacity={0.7}
          >
            <Image
              source={MAP_PIN_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Bouton de navigation Caméra */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/camera")} // Naviguer vers l'écran /camera lors de l'appui
            activeOpacity={0.7}
          >
            <Image
              source={CAMERA_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Bouton de navigation Niveau d'eau */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/level")} // Naviguer vers l'écran /level lors de l'appui
            activeOpacity={0.7}
          >
            <Image
              source={WAVES_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Bouton pour changer les données GeoJson */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/database")}
            activeOpacity={0.7}
          >
            <Feather name="database" size={72} color="black" />
          </TouchableOpacity>
        </View>
      <StatusBar hidden={true} />
      </View>
    </ImageBackground>

  );
}
