import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type Props = {
  uri: string;
  onRetake: () => void;
  onConfirm: () => void;
};

/** "After Photo" frame in the wireframe: captured image + Retake / Confirm. */
export default function PhotoPreview({ uri, onRetake, onConfirm }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />

      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.retake]} onPress={onRetake}>
          <Text style={styles.retakeText}>Retake</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.confirm]} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  image: { flex: 1, backgroundColor: Colors.panel, borderRadius: 4 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  retake: { backgroundColor: Colors.panel },
  retakeText: { color: Colors.text, fontWeight: '600', fontSize: 16 },
  confirm: { backgroundColor: Colors.navy },
  confirmText: { color: Colors.white, fontWeight: '600', fontSize: 16 },
});
