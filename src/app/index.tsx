import { useRouter } from "expo-router";
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/HOME_SCREEN.png')} // KERREGVIEW ocean background
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          {/* MAPS Button (top) - Location pin icon */}
          <TouchableOpacity 
            style={styles.ellipseButton}
            onPress={() => router.push("/maps")}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../../assets/images/Map pin.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* CAMERA Button (center) */}
          <TouchableOpacity 
            style={styles.ellipseButton}
            onPress={() => router.push("/camera")}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../../assets/images/Camera.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* WATER LEVEL Button (bottom) - Waves icon */}
          <TouchableOpacity 
            style={styles.ellipseButton}
            onPress={() => router.push("/level")}
            activeOpacity={0.7}
          >
            <Image 
              source={require('../../assets/images/Vector.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48, // Spacing between buttons (adjusted to design)
  },
  ellipseButton: {
    // Exact dimensions from KERREGVIEW design
    width: 252,
    height: 114,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Very subtle semi-transparent background
    borderRadius: 57, // To create perfect ellipse (114/2)
    borderWidth: 2.5, // Visible ellipse border
    borderColor: 'rgba(255, 255, 255, 0.9)', // More opaque white border
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 72,
    height: 72,
    opacity: 1, // Ensure icon is fully visible
  },
});
