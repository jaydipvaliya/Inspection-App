import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [openingCamera, setOpeningCamera] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState(DraftStore.get().photoUri);
  const [photoTime, setPhotoTime] = useState(DraftStore.get().photoTime);
  const cameraRef = useRef(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to capture survey photos.');
        return;
      }
    }
    setOpeningCamera(true);
    // simulate camera warm-up so the loading indicator is meaningful
    setTimeout(() => {
      setOpeningCamera(false);
      setShowCamera(true);
    }, 700);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    const time = new Date().toLocaleString();
    setPhotoUri(photo.uri);
    setPhotoTime(time);
    setShowCamera(false);
    DraftStore.update({ photoUri: photo.uri, photoTime: time });
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setPhotoTime(null);
    DraftStore.update({ photoUri: null, photoTime: null });
    openCamera();
  };

  const deletePhoto = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPhotoUri(null);
            setPhotoTime(null);
            DraftStore.update({ photoUri: null, photoTime: null });
          },
        },
      ]
    );
  };

  const handleNext = () => {
    router.push('/location');
  };

  // Live camera view
  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
        />
        <View style={styles.captureBar}>
          <Pressable style={styles.cancelBtn} onPress={() => setShowCamera(false)}>
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.shutterBtn}
            onPress={capturePhoto}
            disabled={!cameraReady}
          >
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={{ width: 50 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Camera" subtitle="Capture a site photo" />
      <View style={styles.body}>
        {openingCamera ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Opening camera...</Text>
          </View>
        ) : photoUri ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <Text style={styles.captureTime}>Captured at: {photoTime}</Text>

            <View style={styles.actionRow}>
              <Pressable style={[styles.actionBtn, styles.retakeBtn]} onPress={retakePhoto}>
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={styles.actionText}>Retake</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={deletePhoto}>
                <Ionicons name="trash" size={18} color="#fff" />
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>

            <Pressable style={styles.submitBtn} onPress={handleNext}>
              <Text style={styles.submitText}>Next: Location →</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <Ionicons name="camera-outline" size={70} color="#94a3b8" />
            <Text style={styles.emptyText}>No photo captured yet</Text>
            <Pressable style={styles.captureCta} onPress={openCamera}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.captureCtaText}>Open Camera</Text>
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
  emptyText: { marginTop: 12, color: '#94a3b8', fontSize: 14 },
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
  previewBox: { flex: 1, alignItems: 'center', paddingTop: 10 },
  previewImage: {
    width: '100%',
    height: 320,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
  },
  captureTime: { marginTop: 10, color: '#64748b', fontSize: 13 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  retakeBtn: { backgroundColor: '#f59e0b' },
  deleteBtn: { backgroundColor: '#dc2626' },
  actionText: { color: '#fff', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  captureBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  cancelBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
});