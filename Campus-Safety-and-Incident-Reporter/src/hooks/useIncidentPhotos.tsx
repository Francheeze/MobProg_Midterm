import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * Business logic for the photos attached to a report:
 * - keeps the list of photo URIs (state)
 * - enforces the max limit
 * - picks images from the gallery
 */
export function useIncidentPhotos(max = 3) {
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhotos = (uris: string[]) => {
    setPhotos((prev) => [...prev, ...uris.filter((u) => !prev.includes(u))].slice(0, max));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const pickFromGallery = async () => {
    const remaining = max - photos.length;
    if (remaining <= 0) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: remaining > 1,
        selectionLimit: remaining,
        quality: 0.7,
      });
      if (!result.canceled) addPhotos(result.assets.map((a) => a.uri));
    } catch {
      Alert.alert('Gallery unavailable', 'Could not open your photos. Please check app permissions.');
    }
  };

  return {
    photos,
    addPhotos,
    removePhoto,
    pickFromGallery,
    canAddMore: photos.length < max,
  };
}