import { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { SurveyStore } from '../data/surveyStore';
import { DraftStore } from '../data/draftStore';
import { Theme } from '../constants/theme';

export default function SettingsScreen() {
  const [notifyOnSubmit, setNotifyOnSubmit] = useState(true); const [autoSaveDraft, setAutoSaveDraft] = useState(true);
  const handleClear = () => Alert.alert('Clear All?', 'Delete all surveys?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: () => { SurveyStore.getAll().forEach(s => SurveyStore.remove(s.id)); DraftStore.reset(); Alert.alert('Done'); } }]);

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" subtitle="Preferences" />
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingRow label="Notify on submit" value={notifyOnSubmit} onChange={setNotifyOnSubmit} />
          <SettingRow label="Auto-save draft" value={autoSaveDraft} onChange={setAutoSaveDraft} isLast />
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable style={({ pressed }) => [styles.dangerCard, pressed && { opacity: 0.8 }]} onPress={handleClear}>
          <View style={{ flex: 1 }}><Text style={styles.dangerTitle}>Clear All Survey Data</Text><Text style={styles.dangerSub}>Permanent deletion</Text></View>
        </Pressable>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={styles.aboutText}>Smart Field Survey</Text>
          <Text style={styles.aboutVersion}>v1.0.0</Text>
          <Text style={styles.aboutSub}>React Native + Expo</Text>
        </View>
      </View>
    </View>
  );
}

function SettingRow({ label, value, onChange, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: Theme.colors.border, true: Theme.colors.black }} thumbColor="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgSecondary }, body: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Theme.colors.black, marginTop: 22, marginBottom: 10 },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Theme.colors.divider },
  rowLabel: { flex: 1, fontSize: 14, color: Theme.colors.black },
  dangerCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.soft,
  },
  dangerTitle: { color: Theme.colors.black, fontWeight: '600', fontSize: 14 },
  dangerSub: { color: Theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  aboutText: { fontSize: 15, color: Theme.colors.black, fontWeight: '600' },
  aboutVersion: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 3 },
  aboutSub: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 4 },
});