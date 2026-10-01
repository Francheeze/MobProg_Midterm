import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const NAVY = '#0f2d55';
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ROW = 36;

type Props = {
  visible: boolean;
  value: string; // "YYYY-MM-DD HH:MM" (24-hour), or '' for now
  onClose: () => void;
  onApply: (value: string) => void; // returns "YYYY-MM-DD HH:MM"
};

const pad = (n: number) => String(n).padStart(2, '0');

function parse(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(value);
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : new Date();
  const h = d.getHours();
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    hour: h % 12 === 0 ? 12 : h % 12, // 1-12
    minute: d.getMinutes(),
    pm: h >= 12,
  };
}

function TimeColumn({
  items,
  selected,
  onSelect,
  visible,
}: {
  items: string[];
  selected: number;
  onSelect: (index: number) => void;
  visible: boolean;
}) {
  const ref = useRef<ScrollView>(null);

  // Scroll so the selected value is visible when the popup opens
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(
      () => ref.current?.scrollTo({ y: Math.max(selected - 1, 0) * ROW, animated: false }),
      50
    );
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <ScrollView
      ref={ref}
      style={styles.col}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {items.map((label, i) => (
        <Pressable
          key={label}
          style={[styles.timeItem, i === selected && styles.timeItemOn]}
          onPress={() => onSelect(i)}
        >
          <Text style={[styles.timeText, i === selected && styles.timeTextOn]}>{label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function DateTimePickerModal({ visible, value, onClose, onApply }: Props) {
  const today = new Date();
  const cy = today.getFullYear();
  const cm = today.getMonth();

  const [sel, setSel] = useState(parse(value));
  const [view, setView] = useState({ year: sel.year, month: sel.month });
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days');

  // Reset to the current value every time the popup opens
  useEffect(() => {
    if (!visible) return;
    const p = parse(value);
    setSel(p);
    setView({ year: p.year, month: p.month });
    setMode('days');
  }, [visible]);

  const first = (new Date(view.year, view.month, 1).getDay() + 6) % 7; // Monday first
  const count = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: count }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);

  const years = Array.from({ length: 6 }, (_, i) => cy - 5 + i); // last 5 years + this year

  const apply = () => {
    const h24 = (sel.hour % 12) + (sel.pm ? 12 : 0);
    onApply(`${sel.year}-${pad(sel.month + 1)}-${pad(sel.day)} ${pad(h24)}:${pad(sel.minute)}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          {/* Month / Year dropdown buttons */}
          <View style={styles.headerRow}>
            <Pressable
              style={styles.dropdown}
              onPress={() => setMode(mode === 'months' ? 'days' : 'months')}
            >
              <Text style={styles.dropdownText}>{MONTHS[view.month]} ▾</Text>
            </Pressable>
            <Pressable
              style={styles.dropdown}
              onPress={() => setMode(mode === 'years' ? 'days' : 'years')}
            >
              <Text style={styles.dropdownText}>{view.year} ▾</Text>
            </Pressable>
          </View>

          {mode === 'days' && (
            <View>
              <View style={styles.weekRow}>
                {WEEKDAYS.map((w, i) => (
                  <Text key={i} style={styles.weekday}>{w}</Text>
                ))}
              </View>
              <View style={styles.grid}>
                {cells.map((d, i) => {
                  if (d === null) return <View key={i} style={styles.cell} />;
                  const future = new Date(view.year, view.month, d) > today;
                  const on =
                    sel.day === d && sel.month === view.month && sel.year === view.year;
                  return (
                    <View key={i} style={styles.cell}>
                      <Pressable
                        disabled={future}
                        style={[styles.day, on && styles.dayOn, future && styles.dayOff]}
                        onPress={() => setSel({ ...sel, year: view.year, month: view.month, day: d })}
                      >
                        <Text style={[styles.dayText, on && styles.dayTextOn]}>{d}</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {mode === 'months' && (
            <View style={styles.pickGrid}>
              {MONTHS.map((m, i) => {
                const disabled = view.year === cy && i > cm;
                return (
                  <Pressable
                    key={m}
                    disabled={disabled}
                    style={[styles.pickItem, view.month === i && styles.pickItemOn, disabled && styles.dayOff]}
                    onPress={() => {
                      setView({ ...view, month: i });
                      setMode('days');
                    }}
                  >
                    <Text style={[styles.dayText, view.month === i && styles.dayTextOn]}>
                      {m.slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {mode === 'years' && (
            <View style={styles.pickGrid}>
              {years.map((y) => (
                <Pressable
                  key={y}
                  style={[styles.pickItem, view.year === y && styles.pickItemOn]}
                  onPress={() => {
                    setView({ year: y, month: y === cy ? Math.min(view.month, cm) : view.month });
                    setMode('days');
                  }}
                >
                  <Text style={[styles.dayText, view.year === y && styles.dayTextOn]}>{y}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Time */}
          <Text style={styles.timeLabel}>Time</Text>
          <View style={styles.timeRow}>
            <TimeColumn
              visible={visible}
              items={Array.from({ length: 12 }, (_, i) => String(i + 1))}
              selected={sel.hour - 1}
              onSelect={(i) => setSel({ ...sel, hour: i + 1 })}
            />
            <TimeColumn
              visible={visible}
              items={Array.from({ length: 60 }, (_, i) => pad(i))}
              selected={sel.minute}
              onSelect={(i) => setSel({ ...sel, minute: i })}
            />
            <TimeColumn
              visible={visible}
              items={['AM', 'PM']}
              selected={sel.pm ? 1 : 0}
              onSelect={(i) => setSel({ ...sel, pm: i === 1 })}
            />
          </View>

          <Pressable style={styles.apply} onPress={apply}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  headerRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dropdownText: { fontWeight: '600', color: '#1c1c1c' },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekday: { width: '14.2857%', textAlign: 'center', fontSize: 11, color: '#6b6b6b' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', padding: 2 },
  day: {
    height: 34,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOn: { backgroundColor: NAVY, borderColor: NAVY },
  dayOff: { opacity: 0.3 },
  dayText: { fontSize: 13, color: '#1c1c1c' },
  dayTextOn: { color: '#fff', fontWeight: '700' },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 8 },
  pickItem: {
    width: '30%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickItemOn: { backgroundColor: NAVY, borderColor: NAVY },
  timeLabel: { fontSize: 11, color: '#6b6b6b', marginTop: 14, marginBottom: 6 },
  timeRow: { flexDirection: 'row', gap: 8 },
  col: { flex: 1, height: ROW * 3, backgroundColor: '#f4f5f7', borderRadius: 8 },
  timeItem: { height: ROW, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  timeItemOn: { backgroundColor: '#e3e3e3' },
  timeText: { color: '#6b6b6b', fontSize: 15 },
  timeTextOn: { color: '#1c1c1c', fontWeight: '700' },
  apply: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  applyText: { color: '#fff', fontWeight: '700' },
});