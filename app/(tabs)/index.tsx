import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import QuickActionCard from '../../components/QuickActionCard';
import StatCard from '../../components/StatCard';
import { SurveyStore } from '../../data/surveyStore';
import { ProfileStore } from '../../data/profileStore';
import { Theme } from '../../constants/theme';

function getGreeting() { const h = new Date().getHours(); if (h < 12) return 'Good Morning'; if (h < 17) return 'Good Afternoon'; return 'Good Evening'; }

export default function Dashboard() {
  const router = useRouter();
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [profile, setProfile] = useState(ProfileStore.get());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll()));
    const b = ProfileStore.subscribe(() => setProfile(ProfileStore.get()));
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    return () => { a(); b(); };
  }, []);

  const today = new Date().toDateString();
  const todaysCount = surveys.filter((s) => new Date(s.date).toDateString() === today).length;
  const recent = surveys.slice(0, 3);

  return (
    <View style={styles.container}>
      <AppHeader title={`${getGreeting()}, ${profile.name}`} subtitle={profile.course} />
      <Animated.ScrollView contentContainerStyle={styles.body} style={{ opacity: fadeAnim }}>

        {/* Search bar */}
        <Pressable style={styles.searchBar} onPress={() => router.push('/history')}>
          <Ionicons name="search-outline" size={18} color={Theme.colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search surveys...</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <StatCard label="Today" value={todaysCount} />
          <StatCard label="Total" value={surveys.length} />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickActionCard icon="add-circle-outline" label="New Survey" onPress={() => router.push('/survey')} />
          <QuickActionCard icon="camera-outline" label="Camera" onPress={() => router.push('/camera')} />
          <QuickActionCard icon="location-outline" label="Location" onPress={() => router.push('/location')} />
          <QuickActionCard icon="people-outline" label="Contacts" onPress={() => router.push('/contacts')} />
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Surveys</Text>
          {surveys.length > 0 && <Pressable onPress={() => router.push('/history')}><Text style={styles.seeAll}>See all</Text></Pressable>}
        </View>
        {recent.length === 0 ? (
          <View style={styles.emptyBox}><Text style={styles.emptyText}>No surveys yet. Create your first one!</Text></View>
        ) : (
          recent.map((s, i) => <SurveyRow key={s.id} survey={s} index={i} onPress={() => router.push(`/survey-detail?id=${s.id}`)} />)
        )}
      </Animated.ScrollView>
    </View>
  );
}

interface SurveyRowProps {
  survey: {
    id: string;
    siteName: string;
    clientName: string;
    priority: string;
  };
  index: number;
  onPress: () => void;
}

function SurveyRow({ survey, index, onPress }: SurveyRowProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }).start(); }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.surveyCardContainer}>
        <Pressable
          onPress={onPress}
          onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
          onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}
        >
          <Animated.View style={[styles.surveyCardInner, { transform: [{ scale: scaleAnim }] }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.surveyTitle}>{survey.siteName}</Text>
              <Text style={styles.surveySub}>{survey.clientName} · {survey.priority}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Theme.colors.textMuted} />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary },
  body: { padding: 16, paddingBottom: 40 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Theme.colors.bgInput, borderRadius: Theme.radius.md, paddingVertical: 13, paddingHorizontal: 16, marginBottom: 18 },
  searchPlaceholder: { color: Theme.colors.textMuted, fontSize: 15 },
  statsRow: { flexDirection: 'row', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Theme.colors.black, marginTop: 24, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { color: Theme.colors.textSecondary, fontSize: 14, fontWeight: '500', marginTop: 24 },
  emptyBox: { paddingVertical: 32, alignItems: 'center', backgroundColor: Theme.colors.surface, borderRadius: Theme.radius.lg, borderWidth: 1, borderColor: Theme.colors.borderLight, ...Theme.shadow.soft },
  emptyText: { color: Theme.colors.textMuted, fontSize: 14 },
  surveyCardContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  surveyCardInner: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Theme.radius.lg,
  },
  surveyTitle: { fontSize: 15, fontWeight: '600', color: Theme.colors.black },
  surveySub: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 3 },
});