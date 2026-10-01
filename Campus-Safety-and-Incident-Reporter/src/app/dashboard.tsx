import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { C, useIncidents } from '../components/incidents/store';
import { Header, Thumb } from '../components/incidents/ui';

export default function Dashboard() {
  const router = useRouter();
  const { items } = useIncidents();
  const [q, setQ] = useState('');
  const list = items.filter(i => [i.title, i.category, i.datetime].join(' ').toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Dashboard" />
      <View style={s.searchWrap}>
        <TextInput style={s.search} placeholder="Search by title, category, date" value={q} onChangeText={setQ} />
        <Text style={{ color: C.mute }}>⌕</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {list.length === 0 && <Text style={s.empty}>No incidents match. Tap + to report one.</Text>}
        {list.map(i => (
          <Pressable key={i.id} style={s.card} onPress={() => router.push(`/incident/${i.id}` as any)}>
            <Thumb uri={i.image[0]} />
            <View style={s.row}><Text style={s.cardTitle}>{i.title}</Text><Text style={s.small}>{i.datetime.slice(0, 10)}</Text></View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable style={s.fab} onPress={() => router.push('/report' as any)} accessibilityLabel="New incident report">
        <Text style={s.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 0, paddingHorizontal: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 6 },
  search: { flex: 1, minWidth: 0, paddingVertical: 10, fontSize: 13, borderWidth: 0, backgroundColor: 'transparent', outlineStyle: 'none' } as any,
  card: { backgroundColor: C.paper, padding: 10, borderRadius: 6, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cardTitle: { fontWeight: '600', fontSize: 13, flex: 1 }, small: { fontSize: 11, color: C.mute },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  plus: { fontSize: 30, color: C.navy, lineHeight: 32 },
  empty: { color: C.mute, textAlign: 'center', marginTop: 40 },
});
