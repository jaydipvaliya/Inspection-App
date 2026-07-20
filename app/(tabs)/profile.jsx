import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../components/AppHeader';
import StatCard from '../../components/StatCard';
import { SurveyStore } from '../../data/surveyStore';
import { ProfileStore } from '../../data/profileStore';
import { Theme } from '../../constants/theme';

export default function ProfileScreen() {
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [profile, setProfile] = useState(ProfileStore.get());
  const [editVisible, setEditVisible] = useState(false);
  const [name, setName] = useState(profile.name); const [roll, setRoll] = useState(profile.roll);
  const [course, setCourse] = useState(profile.course); const [photoUri, setPhotoUri] = useState(profile.photoUri);

  useEffect(() => { const a = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll())); const b = ProfileStore.subscribe(() => setProfile(ProfileStore.get())); return () => { a(); b(); }; }, []);

  const openEdit = () => { setName(profile.name); setRoll(profile.roll); setCourse(profile.course); setPhotoUri(profile.photoUri); setEditVisible(true); };
  const pickImage = async () => { const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (status !== 'granted') { Alert.alert('Permission Required'); return; } const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 }); if (!r.canceled) setPhotoUri(r.assets[0].uri); };
  const handleSave = () => { if (!name.trim()) { Alert.alert('Name Required'); return; } ProfileStore.update({ name: name.trim(), roll: roll.trim(), course: course.trim(), photoUri }); setEditVisible(false); };
  const counts = { Low: 0, Medium: 0, High: 0 }; surveys.forEach((s) => { if (counts[s.priority] !== undefined) counts[s.priority]++; });

  const hasPhoto = profile.photoUri && typeof profile.photoUri === 'string' && profile.photoUri.trim().length > 0;
  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" subtitle="Student & app details" showProfile={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profileCard}>
          <Pressable onPress={openEdit}>
            {hasPhoto ? <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} /> : <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>}
          </Pressable>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.sub}>{profile.roll}</Text>
          <Text style={styles.sub2}>{profile.course}</Text>
          <Pressable style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]} onPress={openEdit}><Text style={styles.editBtnText}>Edit Profile</Text></Pressable>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}><StatCard label="Total" value={surveys.length} /><StatCard label="High" value={counts.High} /></View>
        <View style={styles.statsRow}><StatCard label="Medium" value={counts.Medium} /><StatCard label="Low" value={counts.Low} /></View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Row label="App" value="Smart Field Survey" /><Row label="Built With" value="React Native + Expo" /><Row label="Version" value="1.0.0" isLast />
        </View>
      </ScrollView>

      <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Update Profile</Text>
            <Pressable style={styles.photoPicker} onPress={pickImage}>
              {photoUri ? <Image source={{ uri: photoUri }} style={styles.photoPreview} /> : <View style={styles.photoPlaceholder}><Ionicons name="camera-outline" size={24} color={Theme.colors.textMuted} /></View>}
              <Text style={styles.photoPickerText}>{photoUri ? 'Change Photo' : 'Add Photo'}</Text>
            </Pressable>
            <Text style={styles.mLabel}>Name</Text><TextInput style={styles.mInput} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={Theme.colors.textMuted} />
            <Text style={styles.mLabel}>Roll No.</Text><TextInput style={styles.mInput} value={roll} onChangeText={setRoll} placeholder="Roll" placeholderTextColor={Theme.colors.textMuted} />
            <Text style={styles.mLabel}>Course / Project</Text><TextInput style={styles.mInput} value={course} onChangeText={setCourse} placeholder="Course" placeholderTextColor={Theme.colors.textMuted} />
            <View style={styles.modalActions}>
              <Pressable style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.8 }]} onPress={() => setEditVisible(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]} onPress={handleSave}><Text style={styles.saveText}>Save</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value, isLast }) {
  return <View style={[styles.row, !isLast && styles.rowBorder]}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary },
  body: { padding: 16, paddingBottom: 40 },
  profileCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.card,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 1, borderColor: Theme.colors.border },
  avatarImage: { width: 72, height: 72, borderRadius: 36, marginBottom: 14, borderWidth: 1, borderColor: Theme.colors.border },
  avatarText: { color: Theme.colors.black, fontSize: 24, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: Theme.colors.black },
  sub: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 4 },
  sub2: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 2 },
  editBtn: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.pill, paddingVertical: 9, paddingHorizontal: 24, marginTop: 16 },
  editBtnText: { color: Theme.colors.black, fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Theme.colors.black, marginTop: 28, marginBottom: 14 },
  statsRow: { flexDirection: 'row', marginBottom: 10 },
  aboutCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 18 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Theme.colors.divider },
  rowLabel: { fontSize: 14, color: Theme.colors.textSecondary },
  rowValue: { fontSize: 14, color: Theme.colors.black, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Theme.colors.bgPrimary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Theme.colors.border, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Theme.colors.black, marginBottom: 16 },
  photoPicker: { alignItems: 'center', marginBottom: 16 },
  photoPreview: { width: 72, height: 72, borderRadius: 36 },
  photoPlaceholder: { width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center' },
  photoPickerText: { color: Theme.colors.textSecondary, fontSize: 13, marginTop: 8 },
  mLabel: { fontSize: 13, fontWeight: '600', color: Theme.colors.textSecondary, marginTop: 12, marginBottom: 6 },
  mInput: { backgroundColor: Theme.colors.bgInput, borderRadius: Theme.radius.md, padding: 14, fontSize: 14, color: Theme.colors.black },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 22 },
  cancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: Theme.radius.md, borderWidth: 1, borderColor: Theme.colors.border },
  cancelText: { color: Theme.colors.textSecondary, fontWeight: '600' },
  saveBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: Theme.radius.md, backgroundColor: Theme.colors.black },
  saveText: { color: '#fff', fontWeight: '700' },
});