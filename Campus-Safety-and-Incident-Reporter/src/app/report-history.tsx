import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import IncidentHistoryCard from "../components/incidents/IncidentHistoryCard";
import { C } from "../components/incidents/store";
import { Header } from "../components/incidents/ui";

const reports = [
  {
    title: "Broken Window",
    category: "Property Damage",
    date: "October 1, 2026",
    location: null,
  },
  {
    title: "Suspicious Activity",
    category: "Security",
    date: "September 30, 2026",
    location: null,
  },
  {
    title: "Wet Floor",
    category: "Safety Hazard",
    date: "September 29, 2026",
    location: null,
  },
];

export default function ReportHistory() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredReports = reports.filter((report) =>
    [report.title, report.category, report.date]
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
          {filteredReports.map((report, index) => (
            <IncidentHistoryCard
              key={index}
              photo=""
              title={report.title}
              category={report.category}
              date={report.date}
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
});