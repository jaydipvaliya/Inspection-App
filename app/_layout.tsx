import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { Theme } from "../constants/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Theme.colors.bgPrimary }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: Theme.colors.bgInput,
          drawerActiveTintColor: Theme.colors.black,
          drawerInactiveTintColor: Theme.colors.textSecondary,
          drawerStyle: { backgroundColor: Theme.colors.bgPrimary },
          drawerLabelStyle: { fontSize: 14, fontWeight: "500", marginLeft: -8 },
          drawerItemStyle: { borderRadius: 12, marginHorizontal: 8, marginVertical: 1 },
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Dashboard", drawerIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="camera" options={{ drawerLabel: "Camera", drawerIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="location" options={{ drawerLabel: "Location", drawerIcon: ({ color, size }) => <Ionicons name="location-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="contacts" options={{ drawerLabel: "Contacts", drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="clipboard" options={{ drawerLabel: "Clipboard", drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="settings" options={{ drawerLabel: "Settings", drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
        <Drawer.Screen name="preview" options={{ drawerItemStyle: { display: "none", height: 0 } }} />
        <Drawer.Screen name="survey-detail" options={{ drawerItemStyle: { display: "none", height: 0 } }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
