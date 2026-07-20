import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { DraftStore } from '../../data/draftStore';
import { Theme } from '../../constants/theme';
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function CreateSurvey() {
  const router = useRouter();
  const [siteName, setSiteName] = useState(''); const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState(''); const [priority, setPriority] = useState('');
  const [date, setDate] = useState(new Date()); const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => { const e = {}; if (!siteName.trim()) e.siteName = 'Required'; if (!clientName.trim()) e.clientName = 'Required'; if (!description.trim()) e.description = 'Required'; if (!priority) e.priority = 'Select one'; setErrors(e); return Object.keys(e).length === 0; };

  const handleNext = () => {
    if (!validate()) return;
    DraftStore.update({ siteName: siteName.trim(), clientName: clientName.trim(), description: description.trim(), priority, date: date.toISOString() });
    setSiteName(''); setClientName(''); setDescription(''); setPriority(''); setDate(new Date()); setErrors({});
    router.push('/camera');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="New Survey" subtitle="Fill in the site details" />
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Site Name</Text>
        <TextInput style={[styles.input, errors.siteName && styles.inputError]} placeholder="e.g. Riverside Warehouse" placeholderTextColor={Theme.colors.textMuted} value={siteName} onChangeText={setSiteName} />
        {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}

        <Text style={styles.label}>Client Name</Text>
        <TextInput style={[styles.input, errors.clientName && styles.inputError]} placeholder="e.g. Acme Corp" placeholderTextColor={Theme.colors.textMuted} value={clientName} onChangeText={setClientName} />
        {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea, errors.description && styles.inputError]} placeholder="Brief description" placeholderTextColor={Theme.colors.textMuted} value={description} onChangeText={setDescription} multiline numberOfLines={4} />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <Pressable key={p} style={[styles.chip, priority === p && styles.chipActive]} onPress={() => setPriority(p)}>
              <Text style={[styles.chipText, priority === p && styles.chipTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>
        {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}

        <Text style={styles.label}>Date</Text>
        <Pressable style={styles.input} onPress={() => setShowPicker(true)}><Text style={{ color: Theme.colors.black, fontSize: 14 }}>{date.toDateString()}</Text></Pressable>
        {showPicker && <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowPicker(false); if (d) setDate(d); }} />}

        <Pressable style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.8 }]} onPress={handleNext}>
          <Text style={styles.submitText}>Next: Add Photo</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgPrimary },
  body: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: Theme.colors.textSecondary, marginTop: 18, marginBottom: 8 },
  input: { backgroundColor: Theme.colors.bgInput, borderRadius: Theme.radius.md, padding: 14, fontSize: 14, color: Theme.colors.black },
  inputError: { borderWidth: 1, borderColor: '#D1D5DB' },
  textArea: { height: 90, textAlignVertical: 'top' },
  errorText: { color: Theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  chip: { paddingVertical: 9, paddingHorizontal: 20, borderRadius: Theme.radius.pill, borderWidth: 1, borderColor: Theme.colors.border },
  chipActive: { backgroundColor: Theme.colors.black, borderColor: Theme.colors.black },
  chipText: { color: Theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  submitBtn: { backgroundColor: Theme.colors.black, borderRadius: Theme.radius.md, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 30, flexDirection: 'row', gap: 8 },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});