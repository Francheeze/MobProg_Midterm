import { View, Text, StyleSheet } from "react-native";

type IncidentHistoryCardProps = {
  photo: string;
  title: string;
  category: string;
  date: string;
  location: string | null;
};

export default function IncidentHistoryCard({
  title,
  category,
  date,
  location,
}: IncidentHistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <Text style={styles.photoPlaceholder}>X</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.category}>
          {category}
        </Text>

        <Text style={styles.date}>
          {date}
        </Text>

        <Text style={styles.location}>
          {location ?? "Location unavailable"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  photo: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },

  photoPlaceholder: {
    fontSize: 24,
    color: "#888",
  },

  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  category: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  date: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  location: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});