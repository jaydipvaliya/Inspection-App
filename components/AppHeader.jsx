import { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ProfileStore } from '../data/profileStore';
import { Theme } from '../constants/theme';

export default function AppHeader({ title, subtitle, showMenu = true, showProfile = true }) {
  const navigation = useNavigation();
  const router = useRouter();
  const [profile, setProfile] = useState(ProfileStore.get());

  useEffect(() => {
    const unsub = ProfileStore.subscribe(() => setProfile(ProfileStore.get()));
    return unsub;
  }, []);

  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';
  const hasPhoto = profile.photoUri && typeof profile.photoUri === 'string' && profile.photoUri.trim().length > 0;

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showMenu && (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
            hitSlop={10}
          >
            <Ionicons name="menu-outline" size={24} color={Theme.colors.black} />
          </Pressable>
        )}
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>

      {showProfile && (
        <Pressable onPress={() => router.push('/profile')} hitSlop={10}>
          <View style={styles.avatarBtn}>
            {hasPhoto ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initial}</Text>
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Theme.colors.bgPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  iconBtn: { marginRight: 14, justifyContent: 'center', alignItems: 'center' },
  title: { color: Theme.colors.black, fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: Theme.colors.textSecondary, fontSize: 13, marginTop: 1 },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: Theme.colors.black, fontSize: 14, fontWeight: '700' },
});