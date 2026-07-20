import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';
import { Theme } from '../constants/theme';

const generateSurveyId = (d) => { const p = d.siteName ? d.siteName.substring(0, 3).toUpperCase() : 'SRV'; return `${p}-${Date.now().toString().slice(-6)}`; };

export default function ClipboardScreen() {
  const router = useRouter(); const [draft] = useState(DraftStore.get());
  const [surveyId] = useState(generateSurveyId(DraftStore.get()));
  const [notes, setNotes] = useState(DraftStore.get().notes || '');
  const [clipboardPreview, setClipboardPreview] = useState('');

  useEffect(() => { DraftStore.update({ surveyId }); checkClipboard(); }, []);
  const checkClipboard = async () => { const h = await Clipboard.hasStringAsync(); if (h) setClipboardPreview(await Clipboard.getStringAsync()); else setClipboardPreview(''); };
  const copyTo = async (l, v) => { if (!v) { Alert.alert('Nothing to Copy'); return; } await Clipboard.setStringAsync(v); setClipboardPreview(v); Alert.alert('Copied', `${l} copied.`); };
  const pasteNotes = async () => { const h = await Clipboard.hasStringAsync(); if (!h) { Alert.alert('Empty'); return; } const t = await Clipboard.getStringAsync(); setNotes(p => (p ? `${p} ${t}` : t)); };
  const clearCB = async () => { await Clipboard.setStringAsync(''); setClipboardPreview(''); Alert.alert('Cleared'); };
  const locText = draft.location ? `${draft.location.latitude.toFixed(6)}, ${draft.location.longitude.toFixed(6)}` : null;

  return (
    <View style={styles.container}>
      <AppHeader title="Clipboard" subtitle="Copy data & add notes" />
      <ScrollView contentContainerStyle={styles.body}>
        <DataRow label="Survey ID" value={surveyId} onCopy={() => copyTo('Survey ID', surveyId)} />
        <DataRow label="Contact" value={draft.contact?.number || 'Not selected'} onCopy={() => copyTo('Contact', draft.contact?.number)} />
        <DataRow label="Location" value={locText || 'Not captured'} onCopy={() => copyTo('Location', locText)} />

        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput style={styles.notesInput} placeholder="Add site notes..." placeholderTextColor={Theme.colors.textMuted} value={notes} onChangeText={setNotes} multiline numberOfLines={4} />
        <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={pasteNotes}><Text style={styles.outlineBtnText}>Paste from Clipboard</Text></Pressable>

        <Text style={styles.sectionTitle}>Clipboard Contents</Text>
        <View style={styles.previewBox}><Text style={styles.previewText} numberOfLines={2}>{clipboardPreview || 'Empty'}</Text></View>
        <Pressable style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.8 }]} onPress={clearCB}><Text style={styles.outlineBtnText}>Clear Clipboard</Text></Pressable>

        <Pressable style={({ pressed }) => [styles.darkBtn, pressed && { opacity: 0.8 }]} onPress={() => { DraftStore.update({ notes: notes.trim() }); router.push('/preview'); }}>
          <Text style={styles.darkBtnText}>Next: Preview</Text><Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function DataRow({ label, value, onCopy }) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}><Text style={styles.cardLabel}>{label}</Text><Text style={styles.cardValue} numberOfLines={1}>{value}</Text></View>
      <Pressable style={({ pressed }) => [styles.copyBtn, pressed && { opacity: 0.8 }]} onPress={onCopy}><Ionicons name="copy-outline" size={16} color="#fff" /></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  cardLabel: { fontSize: 11, color: Theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardValue: { fontSize: 14, fontWeight: '600', color: Theme.colors.black, marginTop: 3 },
  copyBtn: { backgroundColor: Theme.colors.black, padding: 10, borderRadius: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Theme.colors.black, marginTop: 22, marginBottom: 10 },
  notesInput: { backgroundColor: Theme.colors.bgInput, borderRadius: Theme.radius.md, padding: 14, height: 100, textAlignVertical: 'top', fontSize: 14, color: Theme.colors.black },
  previewBox: { backgroundColor: Theme.colors.bgInput, borderRadius: Theme.radius.md, padding: 14, minHeight: 50 },
  previewText: { color: Theme.colors.textSecondary, fontSize: 13 },
  outlineBtn: { alignSelf: 'flex-start', paddingVertical: 9, paddingHorizontal: 16, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.border, marginTop: 10 },
  outlineBtnText: { color: Theme.colors.black, fontWeight: '600', fontSize: 13 },
  darkBtn: { backgroundColor: Theme.colors.black, borderRadius: Theme.radius.md, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 28, flexDirection: 'row', gap: 8 },
  darkBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});