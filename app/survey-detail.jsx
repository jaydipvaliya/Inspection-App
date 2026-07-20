import { View, Text, Image, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { SurveyStore } from '../data/surveyStore';

const PRIORITY_COLORS = { Low: '#16a34a', Medium: '#f59e0b', High: '#dc2626' };

export default function SurveyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const survey = SurveyStore.getAll().find((s) => s.id === id);

  if (!survey) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
        <AppHeader title="Survey Not Found" showProfile={false} />
        <View style={styles.centerBox}>
          <Ionicons name="alert-circle-outline" size={50} color="#94a3b8" />
          <Text style={styles.emptyText}>This survey may have been deleted.</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Survey', `Delete "${survey.siteName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          SurveyStore.remove(survey.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title={survey.siteName} subtitle={survey.clientName} showProfile={false} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.siteName}>{survey.siteName}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[survey.priority] || '#94a3b8' }]}>
            <Text style={styles.priorityText}>{survey.priority}</Text>
          </View>
        </View>
        <Text style={styles.dateText}>
          {survey.date ? new Date(survey.date).toDateString() : '—'}
        </Text>

        {survey.photoUri && (
          <Image source={{ uri: survey.photoUri }} style={styles.photo} />
        )}

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Description</Text>
          <Text style={styles.detailValue}>{survey.description || '—'}</Text>

          <Text style={styles.detailLabel}>Contact</Text>
          <Text style={styles.detailValue}>
            {survey.contact ? `${survey.contact.name} (${survey.contact.number})` : '—'}
          </Text>

          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>
            {survey.location
              ? `${survey.location.latitude.toFixed(6)}, ${survey.location.longitude.toFixed(6)}`
              : '—'}
          </Text>

          <Text style={styles.detailLabel}>Notes</Text>
          <Text style={styles.detailValue}>{survey.notes || '—'}</Text>
        </View>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete Survey</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, color: '#94a3b8' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  priorityBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  priorityText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
  photo: { width: '100%', height: 200, borderRadius: 12, marginTop: 16, backgroundColor: '#e2e8f0' },
  detailCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginTop: 16, elevation: 1 },
  detailLabel: { fontSize: 12, color: '#94a3b8', marginTop: 12 },
  detailValue: { fontSize: 14, color: '#1e293b', fontWeight: '600', marginTop: 2 },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
  },
  deleteBtnText: { color: '#fff', fontWeight: '700' },
});