// services/pendingPhoto.ts
let pending: string | null = null;

export function setPendingPhoto(uri: string) {
  pending = uri;
}

export function takePendingPhoto() {
  const uri = pending;
  pending = null;
  return uri;
}