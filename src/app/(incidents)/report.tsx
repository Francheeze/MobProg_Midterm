import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { C, CATEGORIES, useIncidents, Incident } from '../../components/incidents/store';
import { Header } from '../../components/incidents/ui';

type Draft = Omit<Incident, 'id'> & { id?: string };
const empty: Draft = { title: '', category: '', description: '', location: '', datetime: '', image: null };

export default function Report() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { items, save } = useIncidents();
  const [f, setF] = useState<Draft>(() => items.find(i => i.id === id) ?? empty);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: keyof Draft) => (v: string | null) => setF({ ...f, [k]: v });

  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!r.canceled) set('image')(r.assets[0].uri);
  };
  const submit = () => {
    if (!f.title.trim() || !f.category) return setErr('Add a title and choose a category.');
    save({ ...f, datetime: f.datetime || new Date().toISOString().slice(0, 16).replace('T', ' ') });
    router.replace('/dashboard' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Incident Report Form" back />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable style={s.upload} onPress={pick} accessibilityLabel="Add photo">
          {f.image ? <Image source={{ uri: f.image }} style={{ width: '100%', height: '100%', borderRadius: 8 }} /> : <Text style={{ fontSize: 28 }}>📷</Text>}
        </Pressable>
        <Text style={s.label}>Title</Text>
        <TextInput style={s.input} value={f.title} onChangeText={set('title')} />
        <Text style={s.label}>Category</Text>
        <Pressable style={s.input} onPress={() => setOpen(!open)}>
          <Text style={{ color: f.category ? C.ink : C.mute }}>{f.category || 'Select option'} ▾</Text>
        </Pressable>
        {open && <View style={s.menu}>{CATEGORIES.map(c => (
          <Pressable key={c} style={{ padding: 10 }} onPress={() => { set('category')(c); setOpen(false); }}><Text>{c}</Text></Pressable>
        ))}</View>}
        <Text style={s.label}>Description</Text>
        <TextInput style={[s.input, s.area]} multiline placeholder="Type here…" value={f.description} onChangeText={set('description')} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Text style={s.label}>Date & Time</Text>
            <TextInput style={s.input} placeholder="YYYY-MM-DD HH:MM" value={f.datetime} onChangeText={set('datetime')} /></View>
          <View style={{ flex: 1 }}><Text style={s.label}>Location</Text>
            <TextInput style={s.input} placeholder="📍" value={f.location} onChangeText={set('location')} /></View>
        </View>
        {!!err && <Text style={s.err}>{err}</Text>}
        <Pressable style={s.submit} onPress={submit}><Text style={s.submitTxt}>Submit report</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 11, color: C.mute, marginTop: 14, marginBottom: 4 },
  upload: { width: 96, height: 96, alignSelf: 'center', backgroundColor: '#fff', borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  input: { backgroundColor: '#e3e3e3', borderRadius: 6, padding: 10, fontSize: 13, justifyContent: 'center', minHeight: 40 },
  area: { height: 90, textAlignVertical: 'top', borderWidth: 2, borderColor: '#e07a1f', backgroundColor: '#fff' },
  menu: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 6, marginTop: 4 },
  err: { color: '#b3261e', marginTop: 12 },
  submit: { backgroundColor: C.navy, borderRadius: 6, padding: 14, alignItems: 'center', marginTop: 24 },
  submitTxt: { color: '#fff', fontWeight: '700' },
});
