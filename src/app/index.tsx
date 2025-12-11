// Import navigation and core React Native components
import { buttonStyle } from "@/style/button/button_style";
import { iconStyle } from "@/style/icon/icon_style";
import { screenStyle } from "@/style/screen/screen_style";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { Image, ImageBackground, StatusBar, TouchableOpacity, View } from "react-native";

// --- Assets ---
// Load all required images locally. 'require' ensures they are bundled with the app.
const OCAEN_BACKGROUN = require('../assets/images/home_screen.png');
const MAP_PIN_ICON = require('../assets/images/map_pin.png');
const CAMERA_ICON = require('../assets/images/camera.png');
const WAVES_ICON = require('../assets/images/vector.png');

/**
 * Main home screen component (Index route).
 * Displays navigation buttons over a background image.
 */
export default function Index() {
  // 'useRouter' hook provides navigation functions.
  const router = useRouter();

  return (
    <ImageBackground
      source={OCAEN_BACKGROUN}
      style={screenStyle.background}
      resizeMode="cover"
    >
      <View style={screenStyle.container}>
        <View style={buttonStyle.buttonContainer}>

          {/* Map Navigation Button */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/maps")} // Navigate to the /maps screen on press
            activeOpacity={0.7}
          >
            <Image
              source={MAP_PIN_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Camera Navigation Button */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/camera")} // Navigate to the /camera screen on press
            activeOpacity={0.7}
          >
            <Image
              source={CAMERA_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Water Level Navigation Button */}
          <TouchableOpacity
            style={buttonStyle.ellipseButton}
            onPress={() => router.push("/level")} // Navigate to the /level screen on press
            activeOpacity={0.7}
          >
            <Image
              source={WAVES_ICON}
              style={iconStyle.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Change GeoJson data Button */}
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
