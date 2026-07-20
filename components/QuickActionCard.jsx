import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';

export default function QuickActionCard({ icon, label, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();

  return (
    <Animated.View style={[styles.outer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.cardShadow}>
        <Pressable
          style={styles.cardPressable}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
        >
          <View style={styles.iconCircle}><Ionicons name={icon} size={20} color={Theme.colors.textSecondary} /></View>
          <Text style={styles.label}>{label}</Text>
          <Ionicons name="arrow-forward" size={14} color={Theme.colors.textMuted} style={styles.arrow} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: { width: '47%', marginBottom: 14 },
  cardShadow: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    ...Theme.shadow.card,
  },
  cardPressable: {
    padding: 16,
    borderRadius: Theme.radius.lg,
  },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: Theme.colors.bgInput, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Theme.colors.black },
  arrow: { position: 'absolute', bottom: 16, right: 16 },
});
