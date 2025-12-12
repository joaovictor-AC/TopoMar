import audioMap from '@/assets/audios';
import { SUBMERGED, VISIBLE } from '@/constants/colors';
import { modalStyle } from '@/style/modal/modal_style';
import { FeatureModalProps } from '@/types/modalTypes';
import { calculateVisibility } from '@/utils/calcHeight';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';


export default function FeatureModal({ visible, onClose, feature, seaLevel, delta }: FeatureModalProps) {
  const [sound, setSound] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Lorsque le modal se ferme, décharger le son
    if (!visible && sound) {
      (async () => {
        try { await sound.stopAsync(); } catch (e) {}
        try { await sound.unloadAsync(); } catch (e) {}
      })();
      setSound(null);
      setIsPlaying(false);
    }
    // Nettoyage lors du démontage
    return () => {
      if (sound) {
        (async () => {
          try { await sound.stopAsync(); } catch (e) {}
          try { await sound.unloadAsync(); } catch (e) {}
        })();
      }
    };
  }, [visible]);

  if (!feature) return null;

  const alt = parseFloat(feature?.properties?.altitude || '0');
  const { isVisible } = calculateVisibility(alt, seaLevel, delta);
  const visibilityText = isVisible ? 'VISIBLE' : 'SUBMERGÉ';

  async function handlePlayAudio() {
    if (!feature) return;

    // Si déjà en lecture, arrêter/décharger
    if (sound && isPlaying) {
      try { await sound.stopAsync(); } catch (e) {}
      try { await sound.unloadAsync(); } catch (e) {}
      setSound(null);
      setIsPlaying(false);
      return;
    }

    const props = feature.properties || {};
    const providedAudio = props.audio as string | undefined;
    let key: string | undefined;
    if (providedAudio) key = providedAudio.replace(/\.[^.]+$/, '').trim();
    if (!key) key = props.nom;

    const module = audioMap[key as string];
    if (!module) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(module, { shouldPlay: true });
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          try { newSound.unloadAsync(); } catch (e) {}
          setSound(null);
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn('Failed to play audio', e);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyle.calloutOverlay}>
        <View style={modalStyle.calloutContent}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={[modalStyle.calloutTitle, modalStyle.mainTitle]}>{feature?.properties?.nom}</Text>
              <Text style={{ backgroundColor: visibilityText === 'VISIBLE' ? VISIBLE : SUBMERGED, ...modalStyle.visibilityContent }}>{visibilityText}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <TouchableOpacity onPress={handlePlayAudio} accessibilityLabel="play-audio">
                <Ionicons name={isPlaying ? 'volume-high-outline' : 'volume-low-outline'} size={26} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} accessibilityLabel="close-modal">
                <Ionicons name="close" size={26} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingTop: 15, gap: 10 }}>
            <Text>
              <Text style={modalStyle.label}>Type : </Text>
              <Text style={modalStyle.value}>{feature?.properties?.featureType || ''}</Text>
            </Text>
            <Text>
              <Text style={modalStyle.label}>Description : </Text>
              <Text style={modalStyle.value}>{feature?.properties?.description || ''}</Text>
            </Text>
            <Text>
              <Text style={modalStyle.label}>Altitude : </Text>
              <Text style={modalStyle.value}>{feature?.properties?.altitude || ''}</Text>
            </Text>
          </View>

        </View>
      </View>
    </Modal>
  );
}
