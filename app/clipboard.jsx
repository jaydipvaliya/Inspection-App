import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { DraftStore } from '../data/draftStore';

// Generate a simple survey ID from the draft (site name + timestamp)
const generateSurveyId = (draft) => {
  const prefix = draft.siteName ? draft.siteName.substring(0, 3).toUpperCase() : 'SRV';
  return `${prefix}-${Date.now().toString().slice(-6)}`;
};

export default function ClipboardScreen() {
  const router = useRouter();
  const [draft, setDraft] = useState(DraftStore.get());
  const [surveyId] = useState(generateSurveyId(DraftStore.get()));
  const [notes, setNotes] = useState(DraftStore.get().notes || '');
  const [clipboardPreview, setClipboardPreview] = useState('');

  useEffect(() => {
    DraftStore.update({ surveyId });
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    const hasString = await Clipboard.hasStringAsync();
    if (hasString) {
      const text = await Clipboard.getStringAsync();
      setClipboardPreview(text);
    } else {
      setClipboardPreview('');
    }
  };

  const copyToClipboard = async (label, value) => {
    if (!value) {
      Alert.alert('Nothing to Copy', `${label} is not available yet.`);
      return;
    }
    await Clipboard.setStringAsync(value);
    setClipboardPreview(value);
    Alert.alert('Copied', `${label} copied to clipboard.`);
  };

  const pasteNotes = async () => {
    const hasString = await Clipboard.hasStringAsync();
    if (!hasString) {
      Alert.alert('Clipboard Empty', 'There is nothing to paste.');
      return;
    }
    const text = await Clipboard.getStringAsync();
    setNotes((prev) => (prev ? `${prev} ${text}` : text));
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    setClipboardPreview('');
    Alert.alert('Cleared', 'Clipboard data has been cleared.');
  };

  const handleNext = () => {
    DraftStore.update({ notes: notes.trim() });
    router.push('/preview');
  };

  const locationText = draft.location
    ? `Lat: ${draft.location.latitude.toFixed(6)}, Lng: ${draft.location.longitude.toFixed(6)}`
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Clipboard" subtitle="Copy survey data & add notes" />
      <ScrollView contentContainerStyle={styles.body}>

        {/* Survey ID */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardLabel}>Survey ID</Text>
              <Text style={styles.cardValue}>{surveyId}</Text>
            </View>
            <Pressable style={styles.copyBtn} onPress={() => copyToClipboard('Survey ID', surveyId)}>
              <Ionicons name="copy-outline" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Contact Number */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Contact Number</Text>
              <Text style={styles.cardValue}>
                {draft.contact?.number || 'Not selected'}
              </Text>
            </View>
            <Pressable
              style={styles.copyBtn}
              onPress={() => copyToClipboard('Contact Number', draft.contact?.number)}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Current Location</Text>
              <Text style={styles.cardValue} numberOfLines={1}>
                {locationText || 'Not captured'}
              </Text>
            </View>
            <Pressable
              style={styles.copyBtn}
              onPress={() => copyToClipboard('Location', locationText)}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Notes with paste */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add site notes here..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
        <View style={styles.notesActionsRow}>
          <Pressable style={styles.pasteBtn} onPress={pasteNotes}>
            <Ionicons name="clipboard-outline" size={16} color="#2563eb" />
            <Text style={styles.pasteText}>Paste from Clipboard</Text>
          </Pressable>
        </View>

        {/* Clipboard preview + clear */}
        <Text style={styles.sectionTitle}>Clipboard Contents</Text>
        <View style={styles.previewBox}>
          <Text style={styles.previewText} numberOfLines={2}>
            {clipboardPreview || 'Clipboard is empty'}
          </Text>
        </View>
        <Pressable style={styles.clearBtn} onPress={clearClipboard}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
          <Text style={styles.clearText}>Clear Clipboard</Text>
        </Pressable>

        <Pressable style={styles.submitBtn} onPress={handleNext}>
          <Text style={styles.submitText}>Next: Preview Survey →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { fontSize: 12, color: '#64748b' },
  cardValue: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 2 },
  copyBtn: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 18, marginBottom: 8 },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 90,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  notesActionsRow: { flexDirection: 'row', marginTop: 10 },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pasteText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  previewBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 50,
  },
  previewText: { color: '#334155', fontSize: 13 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  clearText: { color: '#fff', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 26,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});