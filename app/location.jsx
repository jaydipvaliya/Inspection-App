import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { Theme } from '../constants/theme';

export default function LocationScreen() {
  const router = useRouter(); const [location, setLocation] = useState(DraftStore.get().location);
  const [loading, setLoading] = useState(false); const [errorMsg, setErrorMsg] = useState(null);

  const fetchLocation = async () => { setErrorMsg(null); setLoading(true); try { const { status } = await Location.requestForegroundPermissionsAsync(); if (status !== 'granted') { setErrorMsg('Permission denied'); setLoading(false); return; } const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }); const l = { latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy }; setLocation(l); DraftStore.update({ location: l }); } catch { setErrorMsg('Could not fetch.'); } finally { setLoading(false); } };
  const copyLocation = async () => { if (!location) return; await Clipboard.setStringAsync(`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`); Alert.alert('Copied'); };

  return (
    <View style={styles.container}>
      <AppHeader title="Location" subtitle="Capture coordinates" />
      <View style={styles.body}>
        {loading ? <View style={styles.centerBox}><ActivityIndicator size="large" color={Theme.colors.black} /><Text style={styles.loadingText}>Fetching...</Text></View>
        : location ? (
          <View style={styles.card}>
            <Row label="Latitude" value={location.latitude.toFixed(6)} /><Row label="Longitude" value={location.longitude.toFixed(6)} /><Row label="Accuracy" value={`±${location.accuracy?.toFixed(1)} m`} isLast />
            <View style={styles.btnRow}>
              <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={fetchLocation}><Text style={styles.outlineBtnText}>Refresh</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={copyLocation}><Text style={styles.outlineBtnText}>Copy</Text></Pressable>
            </View>
            <Pressable style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.8 }]} onPress={() => router.push('/contacts')}><Text style={styles.darkBtnText}>Next: Contacts</Text><Ionicons name="arrow-forward" size={16} color="#fff" /></Pressable>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <View style={styles.emptyCircle}><Ionicons name="location-outline" size={40} color={Theme.colors.textMuted} /></View>
            <Text style={styles.emptyTitle}>{errorMsg || 'No location captured'}</Text>
            <Pressable style={({ pressed }) => [styles.darkBtn, { marginTop: 24 }, pressed && { opacity: 0.8 }]} onPress={fetchLocation}><Text style={styles.darkBtnText}>Get Location</Text></Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

function Row({ label, value, isLast }) { return <View style={[styles.row, !isLast && styles.rowBorder]}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { flex: 1, padding: 16 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' }, loadingText: { marginTop: 12, color: Theme.colors.textSecondary },
  emptyCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: Theme.colors.textSecondary, fontSize: 15, textAlign: 'center' },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.card,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 18 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Theme.colors.divider },
  rowLabel: { color: Theme.colors.textSecondary, fontSize: 14 }, rowValue: { color: Theme.colors.black, fontSize: 14, fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 14 },
  outlineBtn: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.border },
  outlineBtnText: { color: Theme.colors.black, fontWeight: '600', fontSize: 13 },
  darkBtn: { backgroundColor: Theme.colors.black, borderRadius: Theme.radius.md, padding: 16, alignItems: 'center', justifyContent: 'center', marginHorizontal: 14, marginVertical: 14, flexDirection: 'row', gap: 8 },
  darkBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});