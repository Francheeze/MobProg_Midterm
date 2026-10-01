import { Pressable, StyleSheet, Text, View } from 'react-native';
import { INCIDENT_CATEGORIES, IncidentCategory } from '../constants/incidents';

type Props = {
  value: IncidentCategory | null;
  onChange: (category: IncidentCategory) => void;
  error?: string;
};

export default function CategorySelector({ value, onChange, error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>
        {INCIDENT_CATEGORIES.map((category) => {
          const selected = value === category;
          return (
            <Pressable
              key={category}
              onPress={() => onChange(category)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  label: { fontSize: 11, color: '#6b6b6b', marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0f2d55',
    backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#0f2d55' },
  chipText: { color: '#0f2d55' },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  error: { color: '#b3261e', marginTop: 6 },
});