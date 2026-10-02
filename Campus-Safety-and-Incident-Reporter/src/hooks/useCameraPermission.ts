import { useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

/**
 * BUSINESS LAYER – camera permission rules.
 *
 * Flow: CHECK -> REQUEST (if allowed) -> handle GRANTED / DENIED -> fallback
 *
 * status:
 *  - 'loading'      : still checking the current permission
 *  - 'granted'      : camera can be used
 *  - 'undetermined' : never asked yet            -> show rationale + request
 *  - 'denied'       : user said no, can ask again -> request again
 *  - 'blocked'      : user said no, OS will not show the prompt again
 *                     (must open phone Settings)
 */
export type CameraPermissionStatus =
  | 'loading'
  | 'granted'
  | 'undetermined'
  | 'denied'
  | 'blocked';

export function useCameraPermission() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();

  let status: CameraPermissionStatus = 'loading';
  if (permission) {
    if (permission.granted) status = 'granted';
    else if (permission.status === 'undetermined') status = 'undetermined';
    else if (permission.canAskAgain) status = 'denied';
    else status = 'blocked';
  }

  // Re-check when the user comes back from the phone's Settings app.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') getPermission();
    });
    return () => sub.remove();
  }, [getPermission]);

  const request = useCallback(async () => {
    const result = await requestPermission();
    return result.granted;
  }, [requestPermission]);

  const openSettings = useCallback(() => Linking.openSettings(), []);

  return { status, isGranted: status === 'granted', request, openSettings };
}
