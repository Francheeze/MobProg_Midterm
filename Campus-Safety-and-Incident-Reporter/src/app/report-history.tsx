import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import IncidentHistoryCard from "../components/incidents/IncidentHistoryCard";
import { C, Incident, useIncidents, useCurrentUser } from "../components/incidents/store";
import { Header } from "../components/incidents/ui";


export default function ReportHistory() {
  const { items, remove } = useIncidents();
  const currentUser = useCurrentUser();
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
                  {selected.image[0] && (
                    <Image source={{ uri: selected.image[0] }} style={styles.previewImage} resizeMode="cover" />
                  )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
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
  previewImage: { width: "100%", height: 170, borderRadius: 6 },
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