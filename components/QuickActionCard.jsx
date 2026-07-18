import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

export default function QuickActionCard({
  icon,
  label,
  color = "#2563eb",
  onPress,
}) {
  return (
    <Pressable style={[styles.card, { borderColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={26} color={color} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    alignItems: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: { marginTop: 10, fontSize: 14, fontWeight: "600", color: "#1e293b" },
});
