import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import IncidentHistoryCard from "../components/incidents/IncidentHistoryCard";
import { C, useIncidents } from "../components/incidents/store";
import { Header } from "../components/incidents/ui";

export default function ReportHistory() {
  const { items } = useIncidents();
  const [query, setQuery] = useState("");
  const reports = items;
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
            />
          ))}
        </ScrollView>
      </View>
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
});