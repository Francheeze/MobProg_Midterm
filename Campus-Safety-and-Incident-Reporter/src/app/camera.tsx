import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import CameraCapture from '@/components/CameraCapture';
import PhotoPreview from '@/components/PhotoPreview';
import PermissionGate from '@/components/PermissionGate';
import { useCameraCapture } from '@/hooks/useCameraCapture';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { Colors } from '@/constants/colors';
import { setPendingPhoto } from '@/services/pendingPhoto';

const REPORT_FORM_ROUTE = '/report';

export default function CameraScreen() {
  const router = useRouter();
  const permission = useCameraPermission();
  const camera = useCameraCapture();

  // 1. Still checking permission
  if (permission.status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.navy} />
      </View>
    );
  }

  // 2. Not granted -> explain + request / open settings + fallback
  if (!permission.isGranted) {
    const isBlocked = permission.status === 'blocked';
    const isDenied = permission.status === 'denied';

    return (
      <PermissionGate
        icon="camera-outline"
        title={isBlocked || isDenied ? 'Camera access is off' : 'Allow camera access'}
        message={
          isBlocked
            ? 'Camera permission was denied. Open Settings and turn on Camera to take photo evidence.'
            : 'The camera is used to capture photo evidence for your incident report.'
        }
        primaryLabel={isBlocked ? 'Open Settings' : isDenied ? 'Try again' : 'Allow camera'}
        onPrimaryPress={isBlocked ? permission.openSettings : permission.request}
        secondaryLabel="Continue without photo"
        onSecondaryPress={() => router.back()}
      />
    );
  }

  // 3. Photo taken -> preview (Retake / Confirm)
  if (camera.photoUri) {
    return (
      <PhotoPreview
        uri={camera.photoUri}
        onRetake={camera.retake}
        onConfirm={() =>
          {
            console.log('CAPTURED URI:', camera.photoUri); 
            setPendingPhoto(camera.photoUri!);
            router.navigate({
              pathname: REPORT_FORM_ROUTE as any
            });
          }
        }
      />
    );
  }

  // 4. Live camera
  return (
    <CameraCapture
      cameraRef={camera.cameraRef}
      facing={camera.facing}
      isCapturing={camera.isCapturing}
      error={camera.error}
      onFlip={camera.flipCamera}
      onCapture={camera.takePicture}
    />
  );
}
