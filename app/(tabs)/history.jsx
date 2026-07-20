import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { SurveyStore } from '../../data/surveyStore';

const PRIORITY_COLORS = { Low: '#16a34a', Medium: '#f59e0b', High: '#dc2626' };
const FILTERS = ['All', 'Low', 'Medium', 'High'];

export default function HistoryScreen() {
  const router = useRouter();
  const [surveys, setSurveys] = useState(SurveyStore.getAll());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const unsub = SurveyStore.subscribe(() => setSurveys(SurveyStore.getAll()));
    return unsub;
  }, []);

  const filtered = surveys.filter((s) => {
    const matchesSearch =
      s.siteName?.toLowerCase().includes(search.toLowerCase()) ||
      s.clientName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || s.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id, siteName) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete "${siteName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => SurveyStore.remove(id),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/survey-detail?id=${item.id}`)}
    >
      <View style={styles.cardHeaderRow}>
        <Text style={styles.siteName}>{item.siteName}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[item.priority] || '#94a3b8' }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <Text style={styles.clientName}>{item.clientName}</Text>
      <View style={styles.cardFooterRow}>
        <Text style={styles.dateText}>
          {item.date ? new Date(item.date).toDateString() : '—'}
        </Text>
        <Pressable
          onPress={() => handleDelete(item.id, item.siteName)}
          style={styles.deleteIcon}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={18} color="#dc2626" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Survey History" subtitle={`${surveys.length} total surveys`} />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by site or client..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.centerBox}>
            <Ionicons name="document-text-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>No surveys found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  filterChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  centerBox: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { marginTop: 10, color: '#94a3b8' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  siteName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  priorityBadge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 8 },
  priorityText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  clientName: { fontSize: 12, color: '#64748b', marginTop: 4 },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: { fontSize: 11, color: '#94a3b8' },
  deleteIcon: { padding: 4 },
});