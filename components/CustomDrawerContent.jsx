import { View, Text, StyleSheet, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const STUDENT = { name: 'Jaydip Valiya', roll: 'SUK25054CE027' };

export default function CustomDrawerContent(props) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{STUDENT.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{STUDENT.name}</Text>
        <Text style={styles.roll}>{STUDENT.roll}</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.itemsContainer}>
        <Text style={styles.sectionLabel}>MENU</Text>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={16} color="#94a3b8" />
        <Text style={styles.footerText}>Smart Field Survey v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#2563eb',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  name: { color: '#fff', fontSize: 16, fontWeight: '700' },
  roll: { color: '#dbeafe', fontSize: 12, marginTop: 2 },
  itemsContainer: { paddingTop: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerText: { fontSize: 11, color: '#94a3b8' },
});