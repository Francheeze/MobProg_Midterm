import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { C, useIncidents, Incident } from '../components/incidents/store';
import CategorySelector from '../components/CategorySelector';
import DescriptionInput from '../components/DescriptionInput';
import { IncidentCategory } from '../constants/incidents';
import { IncidentDetailsErrors, validateIncidentDetails } from '../services/validateIncident';
import { Header } from '../components/incidents/ui';
import LocationSelector from '../components/LocationSelector';

const MIN_IMAGES = 1;
const MAX_IMAGES = 3;

type Draft = Omit<Incident, 'id'> & { id?: string };
const empty: Draft = { title: '', category: '', description: '', location: '', datetime: '', image:[] };

const pad = (n: number) => String(n).padStart(2, '0');
const toText = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fromText = (t: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(t);
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : new Date();
};

export default function Report() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { items, save } = useIncidents();
  const [f, setF] = useState<Draft>(() => items.find(i => i.id === id) ?? empty);
  const [errors, setErrors] = useState<IncidentDetailsErrors>({});
  const [err, setErr] = useState('');
  const [photoErr, setPhotoErr] = useState('');
  const set = <K extends keyof Draft>(k: K) => (v: Draft[K]) =>
    setF(prev => ({ ...prev, [k]: v }));


const openPicker = () => {
  DateTimePickerAndroid.open({
    value: fromText(f.datetime),
    mode: 'date',
    maximumDate: new Date(),
    onValueChange: (_e, date) => {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'time',
        onValueChange: (_e2, time) => {
          const d = new Date(date);
          d.setHours(time.getHours(), time.getMinutes());
          set('datetime')(toText(d));
        },
      });
    },
  });
};

  const pick = async () => {
    const remaining = MAX_IMAGES - f.image.length;
    if (remaining <= 0) return;
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
  });
  if (!r.canceled) {
      set('image')([...f.image, ...r.assets.map(a => a.uri)].slice(0, MAX_IMAGES));
      setPhotoErr('');
    }
  };
  const removeImage = (uri: string) => set('image')(f.image.filter(u => u !== uri));

  const submit = () => {
  const details = validateIncidentDetails((f.category || null) as IncidentCategory | null, f.description);
  setErrors(details);

  const titleMissing = !f.title.trim();
  setErr(titleMissing ? 'Add a title.' : '');

  const tooFewPhotos = f.image.length < MIN_IMAGES;
   setPhotoErr(tooFewPhotos ? `Attach at least ${MIN_IMAGES} photos.` : '');

  if (titleMissing || tooFewPhotos || Object.keys(details).length > 0) return;

  save({ ...f, datetime: f.datetime || new Date().toISOString().slice(0, 16).replace('T', ' ') });
  router.replace('/dashboard' as any);
};

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Incident Report Form" back />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">

                <View style={s.photoRow}>
  {Array.from({ length: MAX_IMAGES }).map((_, i) => {
    const uri = f.image[i];
    return uri ? (
      <Pressable key={uri} style={s.slot} onPress={() => removeImage(uri)} accessibilityLabel="Remove photo">
        <Image source={{ uri }} style={s.slotImg} />
      </Pressable>
    ) : (
      <Pressable key={`empty-${i}`} style={s.slot} onPress={pick} accessibilityLabel="Add photo">
        <Text style={{ fontSize: 28 }}>+</Text>
      </Pressable>
    );
  })}
</View>
<Text style={{ textAlign: 'center', fontSize: 11, color: C.mute }}>
  {f.image.length}/{MAX_IMAGES} photos (minimum {MIN_IMAGES})
</Text>
{!!photoErr && <Text style={[s.err, { textAlign: 'center' }]}>{photoErr}</Text>}
        <Text style={s.label}>Title</Text>
        <TextInput style={s.input} value={f.title} onChangeText={set('title')} />
        <CategorySelector
                        value={(f.category || null) as IncidentCategory | null}
                        onChange={set('category')}
                        error={errors.category}
                      />
                      <DescriptionInput
                        value={f.description}
                        onChangeText={set('description')}
                        error={errors.description}
                      />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Text style={s.label}>Date & Time</Text>

            <Pressable style={s.input} onPress={openPicker}>
            <Text style={{ color: f.datetime ? C.ink : C.mute }}>{f.datetime || 'Select date & time'}</Text>
            </Pressable></View>

          <View style={{ flex: 1 }}>
  <LocationSelector value={f.location} onChange={set('location')} />
</View>
        </View>
        {!!err && <Text style={s.err}>{err}</Text>}
        <Pressable style={s.submit} onPress={submit}><Text style={s.submitTxt}>Submit report</Text></Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  // Form
  label: { fontSize: 11, color: C.mute, marginTop: 14, marginBottom: 4 },
  input: {
    backgroundColor: '#e3e3e3',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    justifyContent: 'center',
    minHeight: 40,
  },
  err: { color: '#b3261e', marginTop: 12 },

  // Photo slots
  photoRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  slot: {
    width: 96,
    height: 96,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.line,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slotImg: { width: '100%', height: '100%' },

  // Submit button
  submit: {
    backgroundColor: C.navy,
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitTxt: { color: '#fff', fontWeight: '700' },
  });