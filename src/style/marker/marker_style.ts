import { StyleSheet } from "react-native";

export const markerStyle = StyleSheet.create({
    marker: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: 'rgba(23, 115, 238, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        transform: [{ translateX: -50 }],
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    markerDistanceText: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 2,
    },
});