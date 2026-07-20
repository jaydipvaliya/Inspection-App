import { useState, useRef } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { Theme } from '../constants/theme';

export default function CameraScreen() {
  const router = useRouter(); const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false); const [openingCamera, setOpeningCamera] = useState(false);
  const [showCamera, setShowCamera] = useState(false); const [facing, setFacing] = useState('back');
  const [photoUri, setPhotoUri] = useState(DraftStore.get().photoUri); const [photoTime, setPhotoTime] = useState(DraftStore.get().photoTime);
  const cameraRef = useRef(null);

  const openCamera = async () => { if (!permission?.granted) { const r = await requestPermission(); if (!r.granted) { Alert.alert('Permission Required'); return; } } setOpeningCamera(true); setTimeout(() => { setOpeningCamera(false); setShowCamera(true); }, 700); };
  const capturePhoto = async () => { if (!cameraRef.current) return; const p = await cameraRef.current.takePictureAsync({ quality: 0.7 }); const t = new Date().toLocaleString(); setPhotoUri(p.uri); setPhotoTime(t); setShowCamera(false); DraftStore.update({ photoUri: p.uri, photoTime: t }); };
  const retakePhoto = () => { setPhotoUri(null); setPhotoTime(null); DraftStore.update({ photoUri: null, photoTime: null }); openCamera(); };
  const deletePhoto = () => Alert.alert('Delete?', '', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { setPhotoUri(null); setPhotoTime(null); DraftStore.update({ photoUri: null, photoTime: null }); } }]);

  if (showCamera) return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} onCameraReady={() => setCameraReady(true)} />
      <View style={styles.captureBar}>
        <Pressable style={styles.sideBtn} onPress={() => setShowCamera(false)}><Ionicons name="close" size={22} color="#fff" /></Pressable>
        <Pressable style={styles.shutterBtn} onPress={capturePhoto} disabled={!cameraReady}><View style={styles.shutterInner} /></Pressable>
        <Pressable style={styles.sideBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}><Ionicons name="camera-reverse" size={22} color="#fff" /></Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Camera" subtitle="Capture a site photo" />
      <View style={styles.body}>
        {openingCamera ? <View style={styles.centerBox}><ActivityIndicator size="large" color={Theme.colors.black} /><Text style={styles.loadingText}>Opening camera...</Text></View>
        : photoUri ? (
          <View style={styles.previewBox}>
            <View style={styles.photoContainer}>
              <View style={styles.photoFrame}>
                <Image source={{ uri: photoUri }} style={styles.previewImage} />
              </View>
            </View>
            <Text style={styles.captureTime}>{photoTime}</Text>
            <View style={styles.actionRow}>
              <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={retakePhoto}><Text style={styles.outlineBtnText}>Retake</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={deletePhoto}><Text style={styles.outlineBtnText}>Delete</Text></Pressable>
            </View>
            <Pressable style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.8 }]} onPress={() => router.push('/location')}><Text style={styles.darkBtnText}>Next: Location</Text><Ionicons name="arrow-forward" size={16} color="#fff" /></Pressable>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <View style={styles.emptyCircle}><Ionicons name="camera-outline" size={40} color={Theme.colors.textMuted} /></View>
            <Text style={styles.emptyTitle}>No photo captured</Text>
            <Pressable style={({ pressed }) => [styles.darkBtn, { marginTop: 24 }, pressed && { opacity: 0.8 }]} onPress={openCamera}><Text style={styles.darkBtnText}>Open Camera</Text></Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { flex: 1, padding: 16 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: Theme.colors.textSecondary },
  emptyCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { color: Theme.colors.textSecondary, fontSize: 15 },
  previewBox: { flex: 1, alignItems: 'center', paddingTop: 8 },
  photoContainer: {
    width: '100%',
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.card,
  },
  photoFrame: { borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: 320, backgroundColor: Theme.colors.bgInput },
  captureTime: { color: Theme.colors.textMuted, fontSize: 12, marginTop: 10 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  outlineBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.border },
  outlineBtnText: { color: Theme.colors.black, fontWeight: '600', fontSize: 13 },
  darkBtn: { backgroundColor: Theme.colors.black, borderRadius: Theme.radius.md, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, width: '100%', flexDirection: 'row', gap: 8 },
  darkBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  captureBar: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 30 },
  sideBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  shutterBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' },
});