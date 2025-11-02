import { useRouter } from "expo-router";
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../../assets/images/HOME_SCREEN.png')} // Fondo del mar KERREGVIEW
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          {/* Botón MAPAS (superior) - Icono de ubicación */}
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

          {/* Botón CÁMARA (centro) */}
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

          {/* Botón NIVEL DEL AGUA (inferior) - Icono de olas */}
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
    gap: 48, // Espaciado entre botones (ajustado según diseño)
  },
  ellipseButton: {
    // Dimensiones exactas del diseño KERREGVIEW
    width: 252,
    height: 114,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fondo muy sutil semi-transparente
    borderRadius: 57, // Para crear la elipse perfecta (114/2)
    borderWidth: 2.5, // Borde visible de la elipse
    borderColor: 'rgba(255, 255, 255, 0.9)', // Borde blanco más opaco
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 72,
    height: 72,
    opacity: 1, // Asegurar que el icono sea completamente visible
  },
});
