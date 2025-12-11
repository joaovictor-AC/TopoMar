import { StyleSheet } from 'react-native';


export const returnButtonStyle = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1,
    },
});