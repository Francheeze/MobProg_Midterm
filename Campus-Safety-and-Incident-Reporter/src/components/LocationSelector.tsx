import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CAMPUS_LOCATIONS } from '../constants/locations';

type Props = {
  value: string;
  onChange: (location: string) => void;
};

export default function LocationSelector({ value, onChange }: Props) {
  const query = value.trim().toLowerCase();

  const matches = query
    ? CAMPUS_LOCATIONS.filter(
        (place) => place.toLowerCase().includes(query) && place.toLowerCase() !== query
      ).slice(0, 5)
    : [];

  return (
    <View>
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Type location…"
        placeholderTextColor="#6b6b6b"
      />
      {matches.length > 0 && (
        <View style={styles.list}>
          {matches.map((place) => (
            <Pressable
              key={place}
              style={styles.item}
              onPress={() => {
                onChange(place);
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.itemText}>📍 {place}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, color: '#6b6b6b', marginTop: 14, marginBottom: 4 },
  input: {
    backgroundColor: '#e3e3e3',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    minHeight: 40,
  },
  list: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 6,
    marginTop: 4,
  },
  item: { paddingVertical: 10, paddingHorizontal: 10 },
  itemText: { fontSize: 13, color: '#1c1c1c' },
});