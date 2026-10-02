type Listener = () => void;

let pending: string[] = [];
const listeners = new Set<Listener>();

/** Camera screen calls this when the user confirms a photo. */
export function setPendingPhoto(uri: string) {
  pending.push(uri);
  listeners.forEach(l => l());
}

/** Returns all waiting photos and clears them. */
export function takeAllPendingPhotos(): string[] {
  const out = pending;
  pending = [];
  return out;
}

/** Kept so older code still works. */
export function takePendingPhoto(): string | null {
  return pending.shift() ?? null;
}

/** The form subscribes so it hears about new photos right away. */
export function subscribePendingPhoto(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}