import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/AppHeader';
import QuickActionCard from '../../components/QuickActionCard';
import StatCard from '../../components/StatCard';
import { SurveyStore } from '../../data/surveyStore';
import { ProfileStore } from '../../data/profileStore';

export default function Dashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [profile, setProfile] = useState(ProfileStore.get());

  useEffect(() => {
    const unsubSurveys = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll()));
    const unsubProfile = ProfileStore.subscribe(() => setProfile(ProfileStore.get()));
    return () => {
      unsubSurveys();
      unsubProfile();
    };
  }, []);

  const today = new Date().toDateString();
  const todaysCount = surveys.filter((s) => new Date(s.date).toDateString() === today).length;
  const recent = surveys.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title={`Welcome, ${profile.name}`} subtitle={profile.course} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Student Details</Text>
        <View style={styles.detailBox}>
          <Text style={styles.detailText}>Name: {profile.name}</Text>
          <Text style={styles.detailText}>Roll No: {profile.roll}</Text>
          <Text style={styles.detailText}>Project: {profile.course}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Today's Surveys" value={todaysCount} />
          <StatCard label="Total Surveys" value={surveys.length} />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickActionCard icon="add-circle-outline" label="New Survey" onPress={() => router.push('/survey')} />
          <QuickActionCard icon="camera-outline" label="Camera" color="#16a34a" onPress={() => router.push('/camera')} />
          <QuickActionCard icon="location-outline" label="Location" color="#dc2626" onPress={() => router.push('/location')} />
          <QuickActionCard icon="people-outline" label="Contacts" color="#9333ea" onPress={() => router.push('/contacts')} />
        </View>

        <Text style={styles.sectionTitle}>Recent Surveys</Text>
        {recent.length === 0 ? (
          <Text style={styles.emptyText}>No surveys yet. Create your first one!</Text>
        ) : (
          recent.map((s) => (
            <Pressable
              key={s.id}
              style={styles.recentCard}
              onPress={() => router.push(`/survey-detail?id=${s.id}`)}
            >
              <Text style={styles.recentTitle}>{s.siteName}</Text>
              <Text style={styles.recentSub}>{s.clientName} • {s.priority}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginTop: 20, marginBottom: 10 },
  detailBox: { backgroundColor: '#fff', borderRadius: 12, padding: 14, elevation: 1 },
  detailText: { fontSize: 13, color: '#334155', marginBottom: 4 },
  statsRow: { flexDirection: 'row', marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic' },
  recentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  recentTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  recentSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
});