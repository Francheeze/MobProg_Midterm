import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { C } from './store';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCapture: () => void;
  onAttach: () => void;
};

export default function PhotoSourceSheet({ visible, onClose, onCapture, onAttach }: Props) {
  const choose = (fn: () => void) => {
    onClose();
    fn();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Dimmed background: tap outside the card to close */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Floating card: stop taps inside from closing */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Add Photo</Text>

          <Pressable style={styles.option} onPress={() => choose(onCapture)}>
            <Text style={styles.optionLabel}>Capture Image</Text>
          </Pressable>

          <Pressable style={styles.option} onPress={() => choose(onAttach)}>
            <Text style={styles.optionLabel}>Attach Image</Text>
          </Pressable>

          <Pressable style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  option: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.line,
    marginBottom: 10,
  },
  optionLabel: { fontSize: 15, fontWeight: '600', color: C.ink },
  cancel: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 2,
  },
  cancelLabel: { fontSize: 14, color: C.mute, fontWeight: '600' },
});