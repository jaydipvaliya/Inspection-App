import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { SurveyStore } from '../../data/surveyStore';
import { Theme } from '../../constants/theme';
const FILTERS = ['All', 'Low', 'Medium', 'High'];

export default function HistoryScreen() {
  const router = useRouter();
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('All');
  useEffect(() => { const u = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll())); return u; }, []);
  const filtered = surveys.filter((s) => { const m = s.siteName?.toLowerCase().includes(search.toLowerCase()) || s.clientName?.toLowerCase().includes(search.toLowerCase()); return m && (filter === 'All' || s.priority === filter); });
  const handleDelete = (id, name) => Alert.alert('Delete', `Delete "${name}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => SurveyStore.remove(id) }]);

  return (
    <View style={styles.container}>
      <AppHeader title="History" subtitle={`${surveys.length} surveys`} />
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Theme.colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor={Theme.colors.textMuted} value={search} onChangeText={setSearch} />
        {search.length > 0 && <Pressable onPress={() => setSearch('')}><Ionicons name="close-circle" size={18} color={Theme.colors.textMuted} /></Pressable>}
      </View>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={({ item, index }) => <Card item={item} index={index} router={router} onDelete={handleDelete} />}
        ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyText}>No surveys found</Text></View>} />
    </View>
  );
}

function Card({ item, index, router, onDelete }) {
  const s = useRef(new Animated.Value(1)).current;
  const f = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(f, { toValue: 1, duration: 350, delay: index * 50, useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={{ opacity: f }}>
      <View style={styles.cardContainer}>
        <Pressable onPress={() => router.push(`/survey-detail?id=${item.id}`)}
          onPressIn={() => Animated.spring(s, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
          onPressOut={() => Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}>
          <Animated.View style={[styles.cardInner, { transform: [{ scale: s }] }]}>
            <View style={styles.cardTop}><Text style={styles.siteName} numberOfLines={1}>{item.siteName}</Text><Text style={styles.badge}>{item.priority}</Text></View>
            <Text style={styles.clientName}>{item.clientName}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.dateText}>{item.date ? new Date(item.date).toDateString() : '—'}</Text>
              <Pressable onPress={() => onDelete(item.id, item.siteName)} hitSlop={8}><Ionicons name="trash-outline" size={16} color={Theme.colors.textMuted} /></Pressable>
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Theme.colors.bgInput, marginHorizontal: 16, marginTop: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: Theme.radius.md },
  searchInput: { flex: 1, fontSize: 14, color: Theme.colors.black },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.border },
  chipActive: { backgroundColor: Theme.colors.black, borderColor: Theme.colors.black },
  chipText: { fontSize: 13, color: Theme.colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: Theme.colors.textMuted },
  cardContainer: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  cardInner: {
    padding: 16,
    borderRadius: Theme.radius.lg,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 15, fontWeight: '600', color: Theme.colors.black, flex: 1, marginRight: 10 },
  badge: { fontSize: 11, fontWeight: '600', color: Theme.colors.textSecondary, backgroundColor: Theme.colors.bgInput, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6, overflow: 'hidden' },
  clientName: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 4 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  dateText: { fontSize: 12, color: Theme.colors.textMuted },
});