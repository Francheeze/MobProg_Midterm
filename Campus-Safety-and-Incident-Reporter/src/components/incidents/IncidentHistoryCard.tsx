import { View, Text, StyleSheet, Image } from "react-native";
import { C } from "./store";

type IncidentHistoryCardProps = {
  photo: string;
  title: string;
  category: string;
  date: string;
  location: string | null;
};

export default function IncidentHistoryCard({
  photo,
  title,
  category,
  date,
  location,
}: IncidentHistoryCardProps) {
  return (
    <View style={styles.card}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
      ) : (
        <View style={styles.photo}>
          <Text style={styles.photoPlaceholder}>X</Text>
        </View>
      )}

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
    backgroundColor: C.paper,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  photo: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: C.line,
    alignItems: "center",
    justifyContent: "center",
  },

  photoPlaceholder: {
    fontSize: 24,
    color: C.navy,
  },

  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: C.ink,
  },

  category: {
    fontSize: 14,
    color: C.navy,
    marginTop: 4,
  },

  date: {
    fontSize: 13,
    color: C.mute,
    marginTop: 4,
  },

  location: {
    fontSize: 13,
    color: C.mute,
    marginTop: 4,
  },
});