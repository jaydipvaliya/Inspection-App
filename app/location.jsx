import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';

export default function LocationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(DraftStore.get().location);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchLocation = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const loc = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
      setLocation(loc);
      DraftStore.update({ location: loc });
    } catch (err) {
      setErrorMsg('Could not fetch location. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyLocation = async () => {
    if (!location) return;
    const text = `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Location copied to clipboard.');
  };

  const handleNext = () => {
    router.push('/contacts');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Location" subtitle="Capture site coordinates" />
      <View style={styles.body}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Fetching location...</Text>
          </View>
        ) : location ? (
          <View style={styles.card}>
            <Ionicons name="location" size={40} color="#dc2626" style={{ alignSelf: 'center' }} />

            <View style={styles.row}>
              <Text style={styles.label}>Latitude</Text>
              <Text style={styles.value}>{location.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Longitude</Text>
              <Text style={styles.value}>{location.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Accuracy</Text>
              <Text style={styles.value}>±{location.accuracy?.toFixed(1)} m</Text>
            </View>

            <Pressable style={styles.refreshBtn} onPress={fetchLocation}>
              <Ionicons name="refresh" size={16} color="#2563eb" />
              <Text style={styles.refreshText}>Refresh Location</Text>
            </Pressable>

            <Pressable style={styles.copyBtn} onPress={copyLocation}>
              <Ionicons name="copy-outline" size={16} color="#fff" />
              <Text style={styles.copyText}>Copy Location</Text>
            </Pressable>

            <Pressable style={styles.submitBtn} onPress={handleNext}>
              <Text style={styles.submitText}>Next: Contacts →</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <Ionicons name="location-outline" size={70} color="#94a3b8" />
            <Text style={styles.emptyText}>
              {errorMsg || 'No location captured yet'}
            </Text>
            <Pressable style={styles.captureCta} onPress={fetchLocation}>
              <Ionicons name="locate" size={18} color="#fff" />
              <Text style={styles.captureCtaText}>Get Current Location</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#64748b' },
  emptyText: { marginTop: 12, color: '#94a3b8', fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },
  captureCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  captureCtaText: { color: '#fff', fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: { color: '#64748b', fontSize: 13 },
  value: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 16,
  },
  refreshText: { color: '#2563eb', fontWeight: '600' },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  copyText: { color: '#fff', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});