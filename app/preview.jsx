import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { SurveyStore } from '../data/surveyStore';

const PRIORITY_COLORS = { Low: '#16a34a', Medium: '#f59e0b', High: '#dc2626' };

export default function PreviewScreen() {
  const router = useRouter();
  const [draft] = useState(DraftStore.get());

  const isComplete = draft.siteName && draft.clientName && draft.priority;

  const handleEdit = () => {
    // Sends the user back to the Create Survey form to make changes.
    // Draft data stays intact in DraftStore since nothing has been submitted yet.
    router.push('/survey');
  };

  const handleSubmit = () => {
    if (!isComplete) {
      Alert.alert('Incomplete Survey', 'Please complete the survey details before submitting.');
      return;
    }

    Alert.alert(
      'Submit Survey',
      'Are you sure you want to submit this survey?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            SurveyStore.add({ ...draft });
            DraftStore.reset();
            Alert.alert('Success', 'Survey submitted successfully!', [
              { text: 'OK', onPress: () => router.push('/history') },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Survey Preview" subtitle="Review before submitting" />
      <ScrollView contentContainerStyle={styles.body}>

        {/* Site & Client Details */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.siteName}>{draft.siteName || 'Untitled Site'}</Text>
            {draft.priority ? (
              <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[draft.priority] }]}>
                <Text style={styles.priorityText}>{draft.priority}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.clientName}>Client: {draft.clientName || '—'}</Text>
          <Text style={styles.description}>{draft.description || 'No description provided'}</Text>
          <Text style={styles.dateText}>
            Date: {draft.date ? new Date(draft.date).toDateString() : '—'}
          </Text>
        </View>

        {/* Photo */}
        <Text style={styles.sectionTitle}>Site Photo</Text>
        <View style={styles.card}>
          {draft.photoUri ? (
            <>
              <Image source={{ uri: draft.photoUri }} style={styles.photo} />
              <Text style={styles.metaText}>Captured: {draft.photoTime}</Text>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="camera-outline" size={22} color="#94a3b8" />
              <Text style={styles.emptyText}>No photo attached</Text>
            </View>
          )}
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.card}>
          {draft.contact ? (
            <View style={styles.contactRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {draft.contact.name?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
              <View>
                <Text style={styles.contactName}>{draft.contact.name}</Text>
                <Text style={styles.contactNumber}>{draft.contact.number}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="person-outline" size={22} color="#94a3b8" />
              <Text style={styles.emptyText}>No contact selected</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.card}>
          {draft.location ? (
            <>
              <Text style={styles.metaText}>Lat: {draft.location.latitude.toFixed(6)}</Text>
              <Text style={styles.metaText}>Lng: {draft.location.longitude.toFixed(6)}</Text>
              <Text style={styles.metaText}>Accuracy: ±{draft.location.accuracy?.toFixed(1)} m</Text>
            </>
          ) : (
            <View style={styles.emptyRow}>
              <Ionicons name="location-outline" size={22} color="#94a3b8" />
              <Text style={styles.emptyText}>No location captured</Text>
            </View>
          )}
        </View>

        {/* Notes */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.card}>
          <Text style={styles.notesText}>{draft.notes || 'No notes added'}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, styles.editBtn]} onPress={handleEdit}>
            <Ionicons name="create-outline" size={18} color="#2563eb" />
            <Text style={styles.editText}>Edit Survey</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.submitBtn]} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.submitText}>Submit Survey</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 6,
    elevation: 1,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  priorityBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  priorityText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  clientName: { fontSize: 13, color: '#64748b', marginTop: 6 },
  description: { fontSize: 13, color: '#334155', marginTop: 8, lineHeight: 18 },
  dateText: { fontSize: 12, color: '#94a3b8', marginTop: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 18, marginBottom: 8 },
  photo: { width: '100%', height: 200, borderRadius: 12, backgroundColor: '#e2e8f0' },
  metaText: { fontSize: 13, color: '#334155', marginTop: 4 },
  emptyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyText: { color: '#94a3b8', fontSize: 13 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700' },
  contactName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  contactNumber: { fontSize: 12, color: '#64748b', marginTop: 2 },
  notesText: { fontSize: 13, color: '#334155', lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  editBtn: { borderWidth: 1.5, borderColor: '#2563eb', backgroundColor: '#fff' },
  editText: { color: '#2563eb', fontWeight: '700' },
  submitBtn: { backgroundColor: '#2563eb' },
  submitText: { color: '#fff', fontWeight: '700' },
});