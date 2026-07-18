import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../../components/AppHeader';
import { DraftStore } from '../../data/draftStore';

const PRIORITIES = ['Low', 'Medium', 'High'];

export default function CreateSurvey() {
  const router = useRouter();
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!siteName.trim()) e.siteName = 'Site name is required';
    if (!clientName.trim()) e.clientName = 'Client name is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!priority) e.priority = 'Select a priority';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    DraftStore.update({
      siteName: siteName.trim(),
      clientName: clientName.trim(),
      description: description.trim(),
      priority,
      date: date.toISOString(),
    });

    // Reset local form for next time
    setSiteName('');
    setClientName('');
    setDescription('');
    setPriority('');
    setDate(new Date());
    setErrors({});

    router.push('/camera');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <AppHeader title="New Survey" subtitle="Fill in the site details" />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Site Name</Text>
        <TextInput
          style={[styles.input, errors.siteName && styles.inputError]}
          placeholder="e.g. Riverside Warehouse"
          value={siteName}
          onChangeText={setSiteName}
        />
        {errors.siteName && <Text style={styles.errorText}>{errors.siteName}</Text>}

        <Text style={styles.label}>Client Name</Text>
        <TextInput
          style={[styles.input, errors.clientName && styles.inputError]}
          placeholder="e.g. Acme Corp"
          value={clientName}
          onChangeText={setClientName}
        />
        {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          placeholder="Brief description of the inspection"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <Pressable
              key={p}
              style={[
                styles.priorityChip,
                priority === p && styles.priorityChipActive,
              ]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>
                {p}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}

        <Text style={styles.label}>Date</Text>
        <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
          <Text>{date.toDateString()}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Pressable style={styles.submitBtn} onPress={handleNext}>
          <Text style={styles.submitText}>Next: Add Photo →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 14,
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  inputError: { borderColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 10,
  },
  priorityChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  priorityText: { color: '#334155', fontSize: 13, fontWeight: '600' },
  priorityTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});