import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../components/AppHeader';
import StatCard from '../../components/StatCard';
import { SurveyStore } from '../../data/surveyStore';
import { ProfileStore } from '../../data/profileStore';

export default function ProfileScreen() {
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [profile, setProfile] = useState(ProfileStore.get());
  const [editVisible, setEditVisible] = useState(false);

  // Local form state, only committed to ProfileStore on Save
  const [name, setName] = useState(profile.name);
  const [roll, setRoll] = useState(profile.roll);
  const [course, setCourse] = useState(profile.course);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);

  useEffect(() => {
    const unsubSurveys = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll()));
    const unsubProfile = ProfileStore.subscribe(() => setProfile(ProfileStore.get()));
    return () => {
      unsubSurveys();
      unsubProfile();
    };
  }, []);

  const openEdit = () => {
    setName(profile.name);
    setRoll(profile.roll);
    setCourse(profile.course);
    setPhotoUri(profile.photoUri);
    setEditVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to set a profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    ProfileStore.update({
      name: name.trim(),
      roll: roll.trim(),
      course: course.trim(),
      photoUri,
    });
    setEditVisible(false);
  };

  const counts = { Low: 0, Medium: 0, High: 0 };
  surveys.forEach((s) => {
    if (counts[s.priority] !== undefined) counts[s.priority]++;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Profile" subtitle="Student & app details" showProfile={false} />
      <ScrollView contentContainerStyle={styles.body}>

        <View style={styles.profileCard}>
          <Pressable onPress={openEdit}>
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.roll}>{profile.roll}</Text>
          <Text style={styles.course}>{profile.course}</Text>

          <Pressable style={styles.editBtn} onPress={openEdit}>
            <Ionicons name="create-outline" size={16} color="#2563eb" />
            <Text style={styles.editBtnText}>Update Profile</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Survey Overview</Text>
        <View style={styles.statsRow}>
          <StatCard label="Total" value={surveys.length} />
          <StatCard label="High Priority" value={counts.High} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Medium Priority" value={counts.Medium} />
          <StatCard label="Low Priority" value={counts.Low} />
        </View>

        <Text style={styles.sectionTitle}>About This App</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="phone-portrait-outline" label="App Name" value="Smart Field Survey" />
          <InfoRow icon="code-slash-outline" label="Built With" value="React Native + Expo" />
          <InfoRow icon="git-branch-outline" label="Version" value="1.0.0" />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Profile</Text>

            <Pressable style={styles.photoPicker} onPress={pickImage}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera-outline" size={26} color="#94a3b8" />
                </View>
              )}
              <Text style={styles.photoPickerText}>
                {photoUri ? 'Change Photo' : 'Add Photo from Gallery'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />

            <Text style={styles.label}>Roll No.</Text>
            <TextInput style={styles.input} value={roll} onChangeText={setRoll} placeholder="Roll number" />

            <Text style={styles.label}>Course / Project</Text>
            <TextInput style={styles.input} value={course} onChangeText={setCourse} placeholder="Course name" />

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#2563eb" style={{ marginRight: 10 }} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  roll: { fontSize: 13, color: '#64748b', marginTop: 4 },
  course: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  editBtnText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginTop: 24, marginBottom: 10 },
  statsRow: { flexDirection: 'row', marginBottom: 10 },
  infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 6, elevation: 1 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: { flex: 1, fontSize: 13, color: '#334155' },
  infoValue: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  photoPicker: { alignItems: 'center', marginBottom: 16 },
  photoPreview: { width: 90, height: 90, borderRadius: 45 },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  photoPickerText: { color: '#2563eb', fontSize: 13, fontWeight: '600', marginTop: 8 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 22 },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cancelText: { color: '#334155', fontWeight: '600' },
  saveBtn: { flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 12, backgroundColor: '#2563eb' },
  saveText: { color: '#fff', fontWeight: '700' },
});