import { Directory, File, Paths } from 'expo-file-system';

/** Copies a temporary photo into permanent app storage and returns the new URI. */
export function persistPhoto(uri: string): string {
  const dir = new Directory(Paths.document, 'incident-photos');
  if (!dir.exists) dir.create();

  const ext = uri.split('?')[0].split('.').pop() || 'jpg';
  const dest = new File(dir, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`);

  new File(uri).copy(dest);
  return dest.uri;
}