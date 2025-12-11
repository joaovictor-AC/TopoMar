import { returnButtonStyle } from '@/style/button/returnButton_style';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function ReturnButton() {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={returnButtonStyle.button}
            onPress={() => router.back()}
        >
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    );
}