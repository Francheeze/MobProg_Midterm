import { Text } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function LocationDisplay() {
  const [status, setStatus] = useState(
    "Getting current location..."
  );

  const [coordinates, setCoordinates] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const currentLocation =
        await Location.getCurrentPositionAsync({});

      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      setStatus("Location retrieved successfully.");

      setCoordinates(
        `Latitude: ${latitude}\nLongitude: ${longitude}`
      );
    } catch (error) {
      setStatus("Unable to retrieve location.");

      setCoordinates(
        "Location permission has not been granted."
      );
    }
  };

  return (
    <>
      <Text>{status}</Text>
      <Text>{coordinates}</Text>
    </>
  );
}