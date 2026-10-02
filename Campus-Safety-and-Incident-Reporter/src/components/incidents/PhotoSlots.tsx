import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

type Props = {
  photos: string[]; // image URIs
  max?: number;
  min?: number;
  onAddPress: () => void; // tapped an empty slot
  onRemove: (index: number) => void; // tapped the X on a filled slot
};

/** Shows `max` slots. Filled slots show the image, empty ones show a "+". */
export default function PhotoSlots({ photos, max = 3, min = 1, onAddPress, onRemove }: Props) {
  const slots = Array.from({ length: max }, (_, i) => photos[i] ?? null);

  return (
    <View>
      <View style={styles.row}>
        {slots.map((uri, index) =>
          uri ? (
            <View key={uri} style={styles.slot}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable style={styles.remove} onPress={() => onRemove(index)} hitSlop={8}>
                <Ionicons name="close" size={16} color={Colors.white} />
              </Pressable>
            </View>
          ) : (
            <Pressable key={`empty-${index}`} style={[styles.slot, styles.empty]} onPress={onAddPress}>
              <Ionicons name="add" size={32} color={Colors.text} />
            </Pressable>
          )
        )}
      </View>
      <Text style={styles.counter}>
        {photos.length}/{max} photos (minimum {min})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  slot: { flex: 1, aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  empty: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: { textAlign: 'center', marginTop: 6, color: Colors.muted, fontSize: 14 },
});