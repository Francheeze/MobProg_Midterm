import type { RefObject } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, type CameraType } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type Props = {
  cameraRef: RefObject<CameraView | null>;
  facing: CameraType;
  isCapturing: boolean;
  error?: string | null;
  onFlip: () => void;
  onCapture: () => void;
};

/** "Camera" frame in the wireframe: live preview, flip button, shutter button. */
export default function CameraCapture({
  cameraRef,
  facing,
  isCapturing,
  error,
  onFlip,
  onCapture,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.controls}>
        {/* Flip camera: text symbol, so it shows even if the icon font fails to load */}
        <Pressable
          onPress={onFlip}
          hitSlop={12}
          accessibilityLabel="Flip camera"
          style={styles.flip}>
          <Text style={styles.flipText}>⇆</Text>
        </Pressable>

        <Pressable
          onPress={onCapture}
          disabled={isCapturing}
          accessibilityLabel="Take photo"
          style={[styles.shutter, isCapturing && styles.disabled]}>
          {isCapturing && <ActivityIndicator color={Colors.navy} />}
        </Pressable>

        <View style={styles.flip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 16 },
  camera: { flex: 1, borderRadius: 8, overflow: 'hidden' },
  error: { color: Colors.danger, textAlign: 'center', marginTop: 8 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  flip: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  flipText: { fontSize: 32, color: Colors.text },
  shutter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.panel,
    borderWidth: 4,
    borderColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
});