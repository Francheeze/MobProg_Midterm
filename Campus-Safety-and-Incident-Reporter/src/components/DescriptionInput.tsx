import { StyleSheet, Text, TextInput, View } from 'react-native';
import { DESCRIPTION_MAX_LENGTH } from '../constants/incidents';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

export default function DescriptionInput({ value, onChangeText, error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type here…"
        multiline
        maxLength={DESCRIPTION_MAX_LENGTH}
        textAlignVertical="top"
      />
      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : <View />}
        <Text style={styles.counter}>
          {value.length}/{DESCRIPTION_MAX_LENGTH}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  label: { fontSize: 11, color: '#6b6b6b', marginBottom: 4 },
  input: {
    height: 90,
    backgroundColor: '#e3e3e3',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: '#b3261e' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  error: { color: '#b3261e', flex: 1 },
  counter: { color: '#6b6b6b', fontSize: 11 },
});