import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';

export default function ContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedContact, setSelectedContact] = useState(DraftStore.get().contact);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setPermissionDenied(false);

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      sort: Contacts.SortTypes.FirstName,
    });

    setContacts(data.filter((c) => c.name));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadContacts();
  }, []);

  const filtered = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getNumber = (contact) => contact.phoneNumbers?.[0]?.number || null;

  const copyNumber = async (number) => {
    if (!number) return;
    await Clipboard.setStringAsync(number);
    Alert.alert('Copied', 'Contact number copied to clipboard.');
  };

  const selectContact = (contact) => {
    const number = getNumber(contact);
    const chosen = { name: contact.name, number: number || 'No Number' };
    setSelectedContact(chosen);
    DraftStore.update({ contact: chosen });
  };

  const handleNext = () => {
    if (!selectedContact) {
      Alert.alert('No Contact Selected', 'Please select a contact to continue.');
      return;
    }
    router.push('/clipboard');
  };

  const renderItem = ({ item }) => {
    const number = getNumber(item);
    const initial = item.name?.charAt(0)?.toUpperCase() || '?';
    const isSelected = selectedContact?.name === item.name;

    return (
      <Pressable
        style={[styles.contactRow, isSelected && styles.contactRowSelected]}
        onPress={() => selectContact(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={number ? styles.contactNumber : styles.noNumber}>
            {number || 'No Number'}
          </Text>
        </View>
        {number && (
          <Pressable style={styles.copyIcon} onPress={() => copyNumber(number)}>
            <Ionicons name="copy-outline" size={20} color="#2563eb" />
          </Pressable>
        )}
        {isSelected && <Ionicons name="checkmark-circle" size={22} color="#16a34a" />}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Contacts" subtitle="Select a contact for this survey" />

      {permissionDenied ? (
        <View style={styles.centerBox}>
          <Ionicons name="people-outline" size={70} color="#94a3b8" />
          <Text style={styles.emptyText}>Contacts permission denied</Text>
          <Pressable style={styles.retryBtn} onPress={loadContacts}>
            <Text style={styles.retryText}>Grant Permission</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterText}>
              {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.centerBox}>
                <Ionicons name="person-remove-outline" size={60} color="#cbd5e1" />
                <Text style={styles.emptyText}>No contacts found</Text>
              </View>
            }
          />

          <View style={styles.footer}>
            <Pressable style={styles.submitBtn} onPress={handleNext}>
              <Text style={styles.submitText}>Next: Clipboard →</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#64748b' },
  emptyText: { marginTop: 12, color: '#94a3b8', fontSize: 14, textAlign: 'center' },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '600' },
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
  counterRow: { paddingHorizontal: 16, marginTop: 10 },
  counterText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  contactRowSelected: { borderWidth: 1.5, borderColor: '#16a34a' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  contactName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  contactNumber: { fontSize: 12, color: '#64748b', marginTop: 2 },
  noNumber: { fontSize: 12, color: '#cbd5e1', marginTop: 2, fontStyle: 'italic' },
  copyIcon: { padding: 6, marginRight: 4 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});