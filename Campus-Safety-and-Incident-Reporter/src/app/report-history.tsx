import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import IncidentHistoryCard from "../components/IncidentHistoryCard";

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {}}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Report History</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search reports..."
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {reports.map((report, index) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 16,
  },

  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

backArrow: {
  fontSize: 32,
  color: "#333",
  marginTop: -4,
},

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  search: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
});