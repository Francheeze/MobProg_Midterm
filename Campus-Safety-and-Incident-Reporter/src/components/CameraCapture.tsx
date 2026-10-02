import type { RefObject } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, type CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type Props = {
  cameraRef: RefObject<CameraView | null>;
  facing: CameraType;
  isCapturing: boolean;
  error?: string | null;
  onFlip: () => void;
  onCapture: () => void;
};

/** "Camera" frame in the wireframe: live preview + flip button + shutter button. */
export default function CameraCapture({
  cameraRef,
  facing,
  isCapturing,
  error,
  onFlip,
  onCapture,
}: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.previewWrapper}>
        <CameraView ref={cameraRef} style={styles.preview} facing={facing} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.controls}>
        <Pressable onPress={onFlip} hitSlop={12} accessibilityLabel="Flip camera">
          <Ionicons name="camera-reverse-outline" size={32} color={Colors.text} />
        </Pressable>

        <Pressable
          onPress={onCapture}
          disabled={isCapturing}
          accessibilityLabel="Take photo"
          style={styles.shutterOuter}
        >
          {isCapturing ? (
            <ActivityIndicator color={Colors.navy} />
          ) : (
            <View style={styles.shutterInner} />
          )}
        </Pressable>

        {/* spacer keeps the shutter centered */}
        <View style={{ width: 32 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  previewWrapper: { flex: 1, margin: 16, backgroundColor: Colors.cameraBg, overflow: 'hidden' },
  preview: { flex: 1 },
  error: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: Colors.danger,
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 16,
    height: 90,
  },
  shutterOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.panel,
  },
  shutterInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white },
});
