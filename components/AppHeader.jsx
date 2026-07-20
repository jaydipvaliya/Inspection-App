import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ProfileStore } from '../data/profileStore';

export default function AppHeader({ title, subtitle, showMenu = true, showProfile = true }) {
  const navigation = useNavigation();
  const router = useRouter();
  const [profile, setProfile] = useState(ProfileStore.get());

  useEffect(() => {
    const unsub = ProfileStore.subscribe(() => setProfile(ProfileStore.get()));
    return unsub;
  }, []);

  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showMenu && (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.iconBtn}
            hitSlop={10}
          >
            <Ionicons name="menu" size={22} color="#fff" />
          </Pressable>
        )}
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      {showProfile && (
        <Pressable onPress={() => router.push('/profile')} style={styles.avatarBtn} hitSlop={10}>
          {profile.photoUri ? (
            <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#1e3a8a',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: { color: '#fff', fontSize: 19, fontWeight: '700' },
  subtitle: { color: '#dbeafe', fontSize: 12.5, marginTop: 2 },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});