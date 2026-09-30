import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, useIncidents } from '../../../components/incidents/store';
import { Header, Thumb } from '../../../components/incidents/ui';

export default function IncidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useIncidents().items.find(i => i.id === id);
  if (!item) return <View style={{ flex: 1 }}><Header title="Incident Report" back /><Text style={s.missing}>This incident no longer exists.</Text></View>;
  const rows: [string, string][] = [['Description', item.description], ['Category', item.category], ['Location', item.location], ['Date & Time', item.datetime]];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Incident Report" back />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={s.card}>
          <Text style={s.title}>{item.title}</Text>
          <Thumb uri={item.image} h={150} />
          {rows.map(([k, v]) => (
            <View key={k} style={{ marginTop: 14 }}><Text style={s.label}>{k}</Text><Text style={s.value}>{v || '—'}</Text></View>
          ))}
        </View>
        <Pressable style={s.edit} onPress={() => router.push({ pathname: '/report', params: { id: item.id } } as any)}>
          <Text style={{ fontWeight: '600' }}>Edit</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff6d6', borderWidth: 2, borderColor: C.yellow, borderRadius: 8, padding: 16 },
  title: { fontWeight: '700', fontSize: 18, textAlign: 'center', marginBottom: 12 },
  label: { fontSize: 11, color: C.mute, marginBottom: 4 }, value: { fontSize: 14, color: C.ink },
  edit: { backgroundColor: '#d9d9d9', borderRadius: 6, padding: 12, alignItems: 'center', marginTop: 20 },
  missing: { textAlign: 'center', marginTop: 40, color: C.mute },
});
