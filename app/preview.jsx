import { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { SurveyStore } from '../data/surveyStore';
import { Theme } from '../constants/theme';

export default function PreviewScreen() {
  const router = useRouter(); const [draft] = useState(DraftStore.get());
  const isComplete = draft.siteName && draft.clientName && draft.priority;
  const handleSubmit = () => { if (!isComplete) { Alert.alert('Incomplete'); return; } Alert.alert('Submit?', '', [{ text: 'Cancel', style: 'cancel' }, { text: 'Submit', onPress: () => { SurveyStore.add({ ...draft }); DraftStore.reset(); Alert.alert('Success', 'Survey submitted!', [{ text: 'OK', onPress: () => router.push('/history') }]); } }]); };

  return (
    <View style={styles.container}>
      <AppHeader title="Preview" subtitle="Review before submitting" />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.headerRow}><Text style={styles.siteName}>{draft.siteName || 'Untitled'}</Text>{draft.priority ? <Text style={styles.badge}>{draft.priority}</Text> : null}</View>
          <Text style={styles.sub}>Client: {draft.clientName || '—'}</Text>
          <Text style={styles.desc}>{draft.description || 'No description'}</Text>
          <Text style={styles.meta}>{draft.date ? new Date(draft.date).toDateString() : '—'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Photo</Text>
        <View style={styles.card}>
          {draft.photoUri ? (
            <>
              <View style={styles.photoContainer}>
                <View style={styles.photoFrame}>
                  <Image source={{ uri: draft.photoUri }} style={styles.photo} />
                </View>
              </View>
              <Text style={styles.meta}>{draft.photoTime}</Text>
            </>
          ) : <Text style={styles.empty}>No photo</Text>}
        </View>

        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.card}>
          {draft.contact ? (
            <View style={styles.contactRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{draft.contact.name?.charAt(0)?.toUpperCase() || '?'}</Text></View>
              <View><Text style={styles.contactName}>{draft.contact.name}</Text><Text style={styles.contactNum}>{draft.contact.number}</Text></View>
            </View>
          ) : <Text style={styles.empty}>No contact</Text>}
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.card}>{draft.location ? (<><Row label="Lat" value={draft.location.latitude.toFixed(6)} /><Row label="Lng" value={draft.location.longitude.toFixed(6)} /><Row label="Accuracy" value={`±${draft.location.accuracy?.toFixed(1)} m`} isLast /></>) : <Text style={styles.empty}>No location</Text>}</View>

        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.card}><Text style={styles.notesText}>{draft.notes || 'No notes'}</Text></View>

        <View style={styles.actionRow}>
          <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={() => router.push('/survey')}><Text style={styles.outlineBtnText}>Edit</Text></Pressable>
          <Pressable style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.8 }]} onPress={handleSubmit}><Text style={styles.darkBtnText}>Submit</Text></Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, isLast }) { return <View style={[styles.row, !isLast && styles.rowBorder]}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Theme.colors.black, marginTop: 22, marginBottom: 8 },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 18, fontWeight: '700', color: Theme.colors.black },
  badge: { fontSize: 11, fontWeight: '600', color: Theme.colors.textSecondary, backgroundColor: Theme.colors.bgInput, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6, overflow: 'hidden' },
  sub: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 6 },
  desc: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 8, lineHeight: 19 },
  meta: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 8 },
  empty: { color: Theme.colors.textMuted, fontSize: 13 },
  photoContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  photoFrame: { borderRadius: 12, overflow: 'hidden' },
  photo: { width: '100%', height: 200, backgroundColor: Theme.colors.bgInput },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  avatarText: { color: Theme.colors.black, fontWeight: '600' },
  contactName: { fontSize: 14, fontWeight: '600', color: Theme.colors.black }, contactNum: { fontSize: 12, color: Theme.colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Theme.colors.divider },
  rowLabel: { color: Theme.colors.textSecondary, fontSize: 13 }, rowValue: { color: Theme.colors.black, fontSize: 13, fontWeight: '600' },
  notesText: { fontSize: 13, color: Theme.colors.textSecondary, lineHeight: 19 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  outlineBtn: { flex: 1, alignItems: 'center', paddingVertical: 15, borderRadius: Theme.radius.md, borderWidth: 1, borderColor: Theme.colors.border },
  outlineBtnText: { color: Theme.colors.black, fontWeight: '600' },
  darkBtn: { flex: 1, alignItems: 'center', paddingVertical: 15, borderRadius: Theme.radius.md, backgroundColor: Theme.colors.black },
  darkBtnText: { color: '#fff', fontWeight: '700' },
});