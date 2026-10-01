import { Text } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

type LocationDisplayProps = {
  onLocationChange?: (location: string | null) => void;
};

export default function LocationDisplay({
  onLocationChange,
}: LocationDisplayProps) {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const currentLocation =
        await Location.getCurrentPositionAsync({});

      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      const locationText =
        `Latitude: ${latitude}\nLongitude: ${longitude}`;

      setLocation(locationText);
      onLocationChange?.(locationText);
    } catch (error) {
      setLocation(null);
      onLocationChange?.(null);
    }
  };

  return (
    <Text>
      {location ?? "Location unavailable"}
    </Text>
  );
}