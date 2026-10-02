// On Expo SDK 54 or newer, use the /legacy import.
// On SDK 53 or older, use: import * as FileSystem from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

const DIR = FileSystem.documentDirectory + 'reports/';

// Copies a photo into permanent storage and returns its new path
export async function keepPhoto(uri: string): Promise<string> {
  if (uri.startsWith(DIR)) return uri; // already saved (e.g. when editing)
  await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  const dest = DIR + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}