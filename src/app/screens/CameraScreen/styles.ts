import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    padding: 10,
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 115, 238, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    // Centraliza o marcador horizontalmente a partir de sua posição 'left'
    transform: [{ translateX: -50 }], 
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ✅ NOVO ESTILO ADICIONADO AQUI
  markerDistanceText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 2,
  },
});