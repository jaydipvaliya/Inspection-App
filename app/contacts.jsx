import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { Theme } from '../constants/theme';

export default function ContactsScreen() {
  const router = useRouter(); const [contacts, setContacts] = useState([]); const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false); const [selectedContact, setSelectedContact] = useState(DraftStore.get().contact);

  const loadContacts = async () => { const { status } = await Contacts.requestPermissionsAsync(); if (status !== 'granted') { setPermissionDenied(true); setLoading(false); setRefreshing(false); return; } setPermissionDenied(false); const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers], sort: Contacts.SortTypes.FirstName }); setContacts(data.filter(c => c.name)); setLoading(false); setRefreshing(false); };
  useEffect(() => { loadContacts(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); loadContacts(); }, []);
  const filtered = contacts.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
  const getNumber = c => c.phoneNumbers?.[0]?.number || null;
  const selectContact = (c) => { const n = getNumber(c); const ch = { name: c.name, number: n || 'No Number' }; setSelectedContact(ch); DraftStore.update({ contact: ch }); };
  const handleNext = () => { if (!selectedContact) { Alert.alert('Select a contact'); return; } router.push('/clipboard'); };

  const renderItem = ({ item, index }) => {
    const n = getNumber(item); const init = item.name?.charAt(0)?.toUpperCase() || '?'; const isSel = selectedContact?.name === item.name;
    return <ContactRow index={index} initial={init} name={item.name} number={n} isSelected={isSel} onPress={() => selectContact(item)} onCopy={() => { if (n) { Clipboard.setStringAsync(n); Alert.alert('Copied'); } }} />;
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Contacts" subtitle="Select a contact" />
      {permissionDenied ? <View style={styles.centerBox}><Text style={styles.emptyText}>Permission denied</Text><Pressable style={({ pressed }) => [styles.darkBtn, { marginTop: 16 }, pressed && { opacity: 0.8 }]} onPress={loadContacts}><Text style={styles.darkBtnText}>Grant</Text></Pressable></View>
      : loading ? <View style={styles.centerBox}><ActivityIndicator size="large" color={Theme.colors.black} /></View>
      : (<>
        <View style={styles.searchBar}><Ionicons name="search-outline" size={18} color={Theme.colors.textMuted} /><TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor={Theme.colors.textMuted} value={search} onChangeText={setSearch} /></View>
        <Text style={styles.counter}>{filtered.length} contacts</Text>
        <FlatList data={filtered} keyExtractor={(i, idx) => i.id || idx.toString()} renderItem={renderItem} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<View style={styles.centerBox}><Text style={styles.emptyText}>No contacts</Text></View>} />
        <View style={styles.footer}><Pressable style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.8 }]} onPress={handleNext}><Text style={styles.darkBtnText}>Next: Clipboard</Text><Ionicons name="arrow-forward" size={16} color="#fff" /></Pressable></View>
      </>)}
    </View>
  );
}

function ContactRow({ index, initial, name, number, isSelected, onPress, onCopy }) {
  const f = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(f, { toValue: 1, duration: 300, delay: Math.min(index * 25, 200), useNativeDriver: true }).start(); }, []);
  return (
    <Animated.View style={{ opacity: f }}>
      <Pressable style={[styles.contactRow, isSelected && styles.contactRowSelected]} onPress={onPress}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.contactName}>{name}</Text><Text style={styles.contactNumber}>{number || 'No Number'}</Text></View>
        {number && <Pressable style={{ padding: 6 }} onPress={onCopy}><Ionicons name="copy-outline" size={16} color={Theme.colors.textMuted} /></Pressable>}
        {isSelected && <Ionicons name="checkmark-circle" size={20} color={Theme.colors.black} />}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }, emptyText: { color: Theme.colors.textMuted },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Theme.colors.bgInput, marginHorizontal: 16, marginTop: 8, paddingHorizontal: 14, paddingVertical: 11, borderRadius: Theme.radius.md },
  searchInput: { flex: 1, fontSize: 14, color: Theme.colors.black },
  counter: { paddingHorizontal: 16, marginTop: 10, color: Theme.colors.textMuted, fontSize: 12, fontWeight: '500' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  contactRowSelected: { borderWidth: 1.5, borderColor: Theme.colors.black },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { color: Theme.colors.black, fontWeight: '600', fontSize: 14 },
  contactName: { fontSize: 14, fontWeight: '600', color: Theme.colors.black },
  contactNumber: { fontSize: 12, color: Theme.colors.textSecondary, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: Theme.colors.bgSecondary, borderTopWidth: 1, borderTopColor: Theme.colors.border },
  darkBtn: { backgroundColor: Theme.colors.black, borderRadius: Theme.radius.md, padding: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  darkBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});