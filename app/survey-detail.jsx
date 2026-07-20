import { View, Text, Image, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { SurveyStore } from '../data/surveyStore';
import { Theme } from '../constants/theme';

export default function SurveyDetailScreen() {
  const { id } = useLocalSearchParams(); const router = useRouter();
  const survey = SurveyStore.getAll().find(s => s.id === id);

  if (!survey) return (
    <View style={styles.container}><AppHeader title="Not Found" showProfile={false} />
      <View style={styles.centerBox}><Text style={styles.emptyText}>This survey may have been deleted.</Text></View></View>
  );

  const handleDelete = () => Alert.alert('Delete?', `Delete "${survey.siteName}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => { SurveyStore.remove(survey.id); router.back(); } }]);

  return (
    <View style={styles.container}>
      <AppHeader title={survey.siteName} subtitle={survey.clientName} showProfile={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.headerRow}><Text style={styles.siteName}>{survey.siteName}</Text><Text style={styles.badge}>{survey.priority}</Text></View>
          <Text style={styles.date}>{survey.date ? new Date(survey.date).toDateString() : '—'}</Text>
        </View>

        {survey.photoUri && (
          <View style={styles.photoContainer}>
            <View style={styles.photoFrame}>
              <Image source={{ uri: survey.photoUri }} style={styles.photo} />
            </View>
          </View>
        )}

        <View style={styles.card}>
          <DetailRow label="Description" value={survey.description || '—'} />
          <DetailRow label="Contact" value={survey.contact ? `${survey.contact.name} (${survey.contact.number})` : '—'} />
          <DetailRow label="Location" value={survey.location ? `${survey.location.latitude.toFixed(6)}, ${survey.location.longitude.toFixed(6)}` : '—'} />
          <DetailRow label="Notes" value={survey.notes || '—'} isLast />
        </View>

        <Pressable style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.8 }]} onPress={handleDelete}><Text style={styles.deleteBtnText}>Delete Survey</Text></Pressable>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, isLast }) {
  return <View style={[styles.detailRow, !isLast && styles.detailRowBorder]}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { padding: 16, paddingBottom: 40 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' }, emptyText: { color: Theme.colors.textMuted },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 18, fontWeight: '700', color: Theme.colors.black },
  badge: { fontSize: 11, fontWeight: '600', color: Theme.colors.textSecondary, backgroundColor: Theme.colors.bgInput, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6, overflow: 'hidden' },
  date: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 8 },
  photoContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.card,
  },
  photoFrame: { borderRadius: 16, overflow: 'hidden' },
  photo: { width: '100%', height: 220, backgroundColor: Theme.colors.bgInput },
  detailRow: { paddingVertical: 14 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: Theme.colors.divider },
  detailLabel: { fontSize: 11, color: Theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 14, color: Theme.colors.black, fontWeight: '500', marginTop: 4, lineHeight: 20 },
  deleteBtn: { borderWidth: 1, borderColor: Theme.colors.border, borderRadius: Theme.radius.md, padding: 15, alignItems: 'center', marginTop: 20 },
  deleteBtnText: { color: Theme.colors.textSecondary, fontWeight: '600' },
});