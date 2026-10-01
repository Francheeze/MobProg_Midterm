import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

/** Reusable fallback screen for ANY permission (camera now, location later). */
export default function PermissionGate({
  icon = 'camera-outline',
  title,
  message,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name={icon} size={64} color={Colors.navy} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Pressable style={styles.primary} onPress={onPrimaryPress}>
        <Text style={styles.primaryText}>{primaryLabel}</Text>
      </Pressable>

      {secondaryLabel && onSecondaryPress && (
        <Pressable style={styles.secondary} onPress={onSecondaryPress}>
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text, marginTop: 16, textAlign: 'center' },
  message: { fontSize: 15, color: Colors.muted, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  primary: {
    marginTop: 28,
    backgroundColor: Colors.navy,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  primaryText: { color: Colors.white, fontWeight: '600', fontSize: 16 },
  secondary: { marginTop: 12, padding: 12 },
  secondaryText: { color: Colors.navy, fontSize: 15 },
});
