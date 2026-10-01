import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './store';

export function Header({ title, back }: { title: string; back?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/dashboard' as any));
  return (
    <View style={[s.header, { paddingTop: insets.top + 12 }]}>
      {back && <Pressable onPress={goBack} accessibilityLabel="Back"><Text style={s.back}>‹</Text></Pressable>}
      <Text style={s.title}>{title}</Text>
    </View>
  );
}

export function Thumb({ uri, h = 120 }: { uri: string | null; h?: number }) {
  return uri
    ? <Image source={{ uri }} style={{ height: h, width: '100%', borderRadius: 4 }} resizeMode="cover" />
    : <View style={[s.ph, { height: h }]}><Text style={s.phX}>✕</Text></View>;
}

const s = StyleSheet.create({
  header: { backgroundColor: C.navy, flexDirection: 'row', alignItems: 'center', padding: 16, gap: 10 },
  title: { color: '#fff', fontWeight: '700', fontSize: 18 },
  back: { color: '#fff', fontSize: 28, lineHeight: 28 },
  ph: { backgroundColor: '#d4d4d4', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  phX: { fontSize: 40, color: '#aaa' },
});
