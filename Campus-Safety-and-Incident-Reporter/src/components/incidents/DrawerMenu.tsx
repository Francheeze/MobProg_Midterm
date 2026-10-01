import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './store';

type Props = { visible: boolean; onClose: () => void; username: string; onLogout: () => void };

const ITEMS = [
  { label: 'Dashboard', icon: 'grid-outline', path: '/dashboard' },
  { label: 'Reports history', icon: 'time-outline', path: '/history' },
] as const;

export default function DrawerMenu({ visible, onClose, username, onLogout }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerW = Math.min(width * 0.78, 320);
  const x = useRef(new Animated.Value(drawerW)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    } else {
      Animated.timing(x, { toValue: drawerW, duration: 180, useNativeDriver: true }).start(({ finished }) => {
        // Only unmount if the close animation wasn't interrupted by a reopen
        if (finished) setMounted(false);
      });
    }
  }, [visible, drawerW]);

  const backdropOpacity = x.interpolate({
    inputRange: [0, drawerW],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const go = (path: string) => {
    onClose();
    if (path === pathname) return; // already here, don't stack a duplicate screen
    router.push({ pathname: path, params: { username } } as any);
  };

  return (
    <Modal visible={mounted} transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={s.root}>
        <Animated.View style={[s.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Close menu" />
        </Animated.View>

        <Animated.View style={[s.drawer, { width: drawerW, transform: [{ translateX: x }] }]}>
          <View style={[s.header, { paddingTop: insets.top + 16 }]}>
            <View style={s.logo}>
  <Image source={require('../../../assets/images/logo.png')} style={s.logoImage} resizeMode="contain" />
</View>
            <Text style={s.appName}>Campus Safety and Incident Reporter</Text>
            <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close menu">
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={s.menu}>
            {ITEMS.map(item => {
              const active = pathname === item.path;
              return (
                <Pressable
                  key={item.path}
                  onPress={() => go(item.path)}
                  style={({ pressed }) => [s.item, active && s.itemActive, pressed && !active && s.itemPressed]}>
                  <Ionicons name={item.icon} size={20} color={C.navy} />
                  <Text style={[s.itemText, active && s.itemTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flex: 1 }} />

          <View style={[s.bottom, { paddingBottom: insets.bottom + 18 }]}>
            <View style={s.profile}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{username.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={s.username} numberOfLines={1}>{username}</Text>
            </View>
            <Pressable
              onPress={() => { onClose(); onLogout(); }}
              style={({ pressed }) => [s.logout, pressed && { opacity: 0.7 }]}>
              <Ionicons name="log-out-outline" size={18} color="#a32d2d" />
              <Text style={s.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, overflow: 'hidden' },
  header: { backgroundColor: C.navy, paddingHorizontal: 14, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 80, height: 80, borderRadius: 19, overflow: 'hidden' },
  logoImage: { width: 80, height: 80 },
  appName: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '600', lineHeight: 16 },
  menu: { paddingTop: 14, paddingHorizontal: 10, gap: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 48, paddingHorizontal: 16, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  itemActive: { backgroundColor: '#fff3c4', borderLeftColor: C.navy },
  itemPressed: { backgroundColor: '#f1f1f1' },
  itemText: { color: C.navy, fontSize: 14 },
  itemTextActive: { fontWeight: '700' },
  bottom: { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 14, paddingHorizontal: 14 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.navy, fontSize: 15, fontWeight: '700' },
  username: { flex: 1, color: C.navy, fontSize: 14, fontWeight: '700' },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42, borderRadius: 8, borderWidth: 1, borderColor: '#f09595', backgroundColor: '#fcebeb' },
  logoutText: { color: '#a32d2d', fontSize: 14, fontWeight: '600' },
});