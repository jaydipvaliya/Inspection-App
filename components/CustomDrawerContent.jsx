import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Theme } from '../constants/theme';

const STUDENT = { name: 'Jaydip Valiya', roll: 'SUK25054CE027' };

export default function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{STUDENT.name.charAt(0)}</Text></View>
        <Text style={styles.name}>{STUDENT.name}</Text>
        <Text style={styles.roll}>{STUDENT.roll}</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.items}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}><Text style={styles.footerText}>Smart Field Survey v1.0.0</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bgPrimary },
  profileHeader: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: Theme.colors.border },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: Theme.colors.black, fontSize: 18, fontWeight: '600' },
  name: { color: Theme.colors.black, fontSize: 16, fontWeight: '600' },
  roll: { color: Theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  items: { paddingTop: 8 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: Theme.colors.border },
  footerText: { fontSize: 11, color: Theme.colors.textMuted },
});