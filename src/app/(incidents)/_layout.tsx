import { Stack } from 'expo-router';
import { IncidentsProvider } from '../../components/incidents/store';

export default function IncidentsLayout() {
  return (
    <IncidentsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </IncidentsProvider>
  );
}
