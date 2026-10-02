import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, CATEGORIES, Incident, useIncidents } from '../components/incidents/store';
import { Header, Thumb } from '../components/incidents/ui';
import DrawerMenu from '../components/incidents/DrawerMenu';

function PhotoSwiper({ photos }: { photos: string[] }) {
  const { width: screenW } = useWindowDimensions();
  const w = screenW - 36 - 32;
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState<string | null>(null);

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled // ADDED
        removeClippedSubviews={false} // ADDED
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / w))}>
        {photos.map((uri, n) => (
          <Pressable key={n} onPress={() => setFull(uri)} style={{ width: w, height: 170 }}>
            <Image
              source={{ uri }}
              style={{ width: w, height: 170, borderRadius: 6 }}
              resizeMode="cover"
              onLoad={() => console.log('IMAGE LOADED:', uri)} // ADDED
              onError={e => console.log('IMAGE FAILED:', uri, e.nativeEvent.error)} // ADDED
            />
          </Pressable>
        ))}
      </ScrollView>
      {photos.length > 1 && (
        <View style={s.dots}>
          {photos.map((_, n) => (
            <View key={n} style={[s.dot, n === index && s.dotActive]} />
          ))}
        </View>
      )}

      <Modal visible={full !== null} transparent animationType="fade" onRequestClose={() => setFull(null)}>
        <Pressable style={s.fullBackdrop} onPress={() => setFull(null)}>
          {full && <Image source={{ uri: full }} style={s.fullImage} resizeMode="contain" />}
          <Text style={s.fullClose}>×</Text>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username?: string }>();
  const { items } = useIncidents();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [preview, setPreview] = useState<Incident | null>(null);
  const query = q.trim().toLowerCase();
  const list = items.filter(i =>
    (category === null || i.category === category) &&
    [i.title, i.category, i.datetime].join(' ').toLowerCase().includes(query)
  );
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Dashboard" />
      <Pressable
        onPress={() => setMenuOpen(true)}
        hitSlop={10}
        accessibilityLabel="Open menu"
        style={[s.menuButton, { top: insets.top + 12 }]}>
        <Text style={{ color: '#fff', fontSize: 28 }}>☰</Text>
      </Pressable>
      <View style={s.searchWrap}>
        <TextInput style={s.search} placeholder="Search by title, category, date" value={q} onChangeText={setQ} />
        <Text style={{ color: C.mute }}>⌕</Text>
      </View>

      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={s.categoriesScroll}
  contentContainerStyle={s.categories}>

        {[null, ...CATEGORIES].map(option => {
          const selected = category === option;
          return (
            <Pressable
              key={option ?? 'all'}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setCategory(option)}
              style={[s.category, selected && s.categorySelected]}>
              <Text style={[s.categoryText, selected && s.categoryTextSelected]}>{option ?? 'All'}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {list.length === 0 && <Text style={s.empty}>No incidents match. Tap + to report one.</Text>}
        {list.map(i => (
          <Pressable key={i.id} style={s.card} onPress={() => setPreview(i)}>
            <Thumb uri={i.image[0]} />
            <View style={s.row}><Text style={s.cardTitle}>{i.title}</Text><Text style={s.small}>{i.datetime.slice(0, 10)}</Text></View>
          </Pressable>
        ))}
      </ScrollView>
      <Modal visible={preview !== null} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <View style={s.modalBackdrop}>
          <View style={s.modal}>
            <View style={s.modalHeader}>
              <Text style={s.modalHeading}>Incident preview</Text>
              <Pressable onPress={() => setPreview(null)} accessibilityRole="button" accessibilityLabel="Close preview" style={s.closeButton}>
                <Text style={s.closeText}>×</Text>
              </Pressable>
            </View>
            {preview && (
              <>
                <ScrollView contentContainerStyle={s.previewContent}>
                  <Text style={s.previewTitle}>{preview.title}</Text>
                  <PhotoSwiper photos={Array.isArray(preview.image) ? preview.image : [preview.image]} />
                  {([
                    ['Category', preview.category],
                    ['Location', preview.location],
                    ['Date & Time', preview.datetime],
                    ['Description', preview.description],
                  ] as [string, string][]).map(([label, value]) => (
                    <View key={label} style={s.detailRow}>
                      <Text style={s.detailLabel}>{label}</Text>
                      <Text style={s.detailValue}>{value || '—'}</Text>
                    </View>
                  ))}
                </ScrollView>
                <Pressable
                  style={s.editButton}
                  onPress={() => {
                    const incidentId = preview.id;
                    setPreview(null);
                    router.push({ pathname: '/report', params: { id: incidentId } } as any);
                  }}>
                  <Text style={s.editText}>Edit report</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Pressable style={s.fab} onPress={() => router.push('/report' as any)} accessibilityLabel="New incident report">
        <Text style={s.plus}>+</Text>
      </Pressable>
      <DrawerMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        username={username ?? 'User'}
        onLogout={() => router.replace('/login' as any)}
      />
    </View>
  );
}

const s = StyleSheet.create({
   menuButton: { position: 'absolute', right: 16, zIndex: 10 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 0, paddingHorizontal: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 6 },
  search: { flex: 1, minWidth: 0, paddingVertical: 10, fontSize: 13, borderWidth: 0, backgroundColor: 'transparent', outlineStyle: 'none' } as any,
  categories: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 8, alignItems: 'center' },
  categoriesScroll: { flexGrow: 0 },
  category: { borderWidth: 1, borderColor: C.line, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#fff' },
  categorySelected: { borderColor: C.navy, backgroundColor: C.navy },
  categoryText: { color: C.ink, fontSize: 12, fontWeight: '600' },
  categoryTextSelected: { color: '#fff' },
  card: { backgroundColor: C.paper, padding: 10, borderRadius: 6, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardTitle: { fontWeight: '600', fontSize: 13, flex: 1 }, small: { fontSize: 11, color: C.mute },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 18 },
  modal: { maxHeight: '88%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 18, paddingRight: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  modalHeading: { color: C.navy, fontSize: 16, fontWeight: '700' },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: C.mute, fontSize: 28, lineHeight: 30 },
  previewContent: { padding: 16 },
  previewTitle: { color: C.ink, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  detailRow: { marginTop: 14 },
  detailLabel: { color: C.mute, fontSize: 11, marginBottom: 4 },
  detailValue: { color: C.ink, fontSize: 14 },
  editButton: { backgroundColor: C.yellow, padding: 13, alignItems: 'center', margin: 16, marginTop: 0, borderRadius: 6 },
  editText: { color: C.navy, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  plus: { fontSize: 30, color: C.navy, lineHeight: 32 },
  empty: { color: C.mute, textAlign: 'center', marginTop: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.line },
dotActive: { backgroundColor: C.navy },
fullBackdrop: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
fullImage: { width: '100%', height: '100%' },
fullClose: { position: 'absolute', top: 40, right: 20, color: '#fff', fontSize: 36 },
});