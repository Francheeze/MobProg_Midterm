import { useCallback, useRef, useState } from 'react';
import type { CameraType, CameraView } from 'expo-camera';

/**
 * BUSINESS LAYER – camera workflow (no UI in here).
 * Holds the state: which lens, the captured photo, busy flag, error.
 */
export function useCameraCapture() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flipCamera = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return; // ignore double taps
    try {
      setIsCapturing(true);
      setError(null);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhotoUri(photo?.uri ?? null);
    } catch {
      setError('Could not take the photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  const retake = useCallback(() => setPhotoUri(null), []);

  return { cameraRef, facing, photoUri, isCapturing, error, flipCamera, takePicture, retake };
}
