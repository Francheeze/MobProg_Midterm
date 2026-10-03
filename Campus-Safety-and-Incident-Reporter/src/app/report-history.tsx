import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IncidentHistoryCard from "../components/incidents/IncidentHistoryCard";
import DrawerMenu from "../components/incidents/DrawerMenu";
import { C, Incident, setCurrentUser, useCurrentUser, useIncidents } from "../components/incidents/store";
import { Header } from "../components/incidents/ui";

function PhotoSwiper({ photos }: { photos: string[] }) {
  const { width: screenW } = useWindowDimensions();
  const width = screenW - 36 - 32;
  const [index, setIndex] = useState(0);

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        removeClippedSubviews={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}>
        {photos.filter(Boolean).map((photo, photoIndex) => (
          <Image
            key={`${photo}-${photoIndex}`}
            source={{ uri: photo }}
            style={{ width, height: 170, borderRadius: 6 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {photos.filter(Boolean).length > 1 && (
        <View style={styles.dots}>
          {photos.filter(Boolean).map((_, photoIndex) => (
            <View key={photoIndex} style={[styles.dot, photoIndex === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

export default function ReportHistory() {
  const insets = useSafeAreaInsets();
  const { username } = useLocalSearchParams<{ username?: string }>();
  const { items, remove } = useIncidents();
  const currentUser = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Incident | null>(null);
  const reports = items.filter((r) => r.author === currentUser);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredReports = reports.filter((report) =>
    [report.title, report.category, report.datetime, report.location]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <View style={styles.container}>
      <Header title="Report History" back />
      <Pressable
        onPress={() => setMenuOpen(true)}
        hitSlop={10}
        accessibilityLabel="Open menu"
        style={[styles.menuButton, { top: insets.top + 12 }]}>
        <Text style={styles.menuText}>☰</Text>
      </Pressable>
      <View style={styles.content}>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.search}
            placeholder="Search reports..."
            value={query}
            onChangeText={setQuery}
          />
          <Text style={styles.searchIcon}>⌕</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredReports.length === 0 && (
            <Text style={styles.empty}>No reports to show yet.</Text>
          )}
          {filteredReports.map((report, index) => (
            <IncidentHistoryCard
              key={report.id}
              photo={report.image[0] ?? ""}
              title={report.title}
              category={report.category}
              date={report.datetime}
              location={report.location}
              onPress={() => setSelected(report)}
            />
          ))}
        </ScrollView>
      </View>
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Incident preview</Text>
              <Pressable onPress={() => setSelected(null)} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>
            {selected && (
              <>
                <ScrollView contentContainerStyle={styles.previewContent}>
                  <Text style={styles.previewTitle}>{selected.title}</Text>
                  <PhotoSwiper photos={selected.image} />
                  {([
                    ["Category", selected.category],
                    ["Location", selected.location],
                    ["Date & Time", selected.datetime],
                    ["Description", selected.description],
                  ] as [string, string][]).map(([label, value]) => (
                    <View key={label} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={styles.detailValue}>{value || "—"}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.actionRow}>
                  <Pressable
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => {
                      const incidentId = selected.id;
                      setSelected(null);
                      router.push({ pathname: "/report", params: { id: incidentId } } as any);
                    }}>
                    <Text style={styles.editText}>Edit report</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => Alert.alert("Delete report?", "This report will be removed from your history.", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => { remove(selected.id); setSelected(null); } },
                    ])}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <DrawerMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        username={username ?? currentUser ?? "User"}
        onLogout={() => {
          setCurrentUser(null);
          router.replace("/login" as any);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  menuButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },

  menuText: {
    color: "#fff",
    fontSize: 28,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
  },

  search: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 0,
    backgroundColor: "transparent",
  },

  searchIcon: {
    color: C.mute,
  },

  empty: {
    color: C.mute,
    textAlign: "center",
    marginTop: 40,
  },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", padding: 18 },
  modal: { maxHeight: "88%", backgroundColor: "#fff", borderRadius: 8, overflow: "hidden" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 18, paddingRight: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  modalHeading: { color: C.navy, fontSize: 16, fontWeight: "700" },
  closeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  closeText: { color: C.mute, fontSize: 28, lineHeight: 30 },
  previewContent: { padding: 16 },
  previewTitle: { color: C.ink, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.line },
  dotActive: { backgroundColor: C.navy },
  detailRow: { marginTop: 14 },
  detailLabel: { color: C.mute, fontSize: 11, marginBottom: 4 },
  detailValue: { color: C.ink, fontSize: 14 },
  actionRow: { flexDirection: "row", gap: 10, margin: 16, marginTop: 0 },
  actionButton: { flex: 1, padding: 13, alignItems: "center", borderRadius: 6 },
  editButton: { backgroundColor: C.yellow },
  editText: { color: C.navy, fontWeight: "700" },
  deleteButton: { backgroundColor: "#fcebeb", borderWidth: 1, borderColor: "#f09595" },
  deleteText: { color: "#a32d2d", fontWeight: "700" },
});