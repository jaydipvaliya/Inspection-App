import { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { SurveyStore } from '../data/surveyStore';
import { DraftStore } from '../data/draftStore';

export default function SettingsScreen() {
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(true);
  const [autoSaveDraft, setAutoSaveDraft] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all submitted surveys. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            SurveyStore.getAll().forEach((s) => SurveyStore.remove(s.id));
            DraftStore.reset();
            Alert.alert('Done', 'All survey data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="Settings" subtitle="App preferences" />
      <View style={styles.body}>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Notify on survey submit"
            value={notifyOnSubmit}
            onChange={setNotifyOnSubmit}
          />
          <SettingRow
            icon="save-outline"
            label="Auto-save draft while editing"
            value={autoSaveDraft}
            onChange={setAutoSaveDraft}
          />
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable style={styles.dangerCard} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.dangerTitle}>Clear All Survey Data</Text>
            <Text style={styles.dangerSub}>Deletes all submitted surveys permanently</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.aboutText}>Smart Field Survey & Inspection App v1.0.0</Text>
          <Text style={styles.aboutSub}>Built with React Native + Expo Router</Text>
        </View>
      </View>
    </View>
  );
}

function SettingRow({ icon, label, value, onChange }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color="#2563eb" style={{ marginRight: 12 }} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: '#2563eb' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 18, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 14, elevation: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLabel: { flex: 1, fontSize: 13, color: '#334155' },
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerTitle: { color: '#dc2626', fontWeight: '700', fontSize: 13 },
  dangerSub: { color: '#b91c1c', fontSize: 11, marginTop: 2 },
  aboutText: { padding: 16, paddingBottom: 4, fontSize: 13, color: '#334155', fontWeight: '600' },
  aboutSub: { paddingHorizontal: 16, paddingBottom: 16, fontSize: 12, color: '#94a3b8' },
});