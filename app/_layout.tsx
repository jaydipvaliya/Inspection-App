import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "../components/CustomDrawerContent";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "#eff6ff",
          drawerActiveTintColor: "#2563eb",
          drawerInactiveTintColor: "#475569",
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            marginLeft: -12,
          },
          drawerItemStyle: {
            borderRadius: 12,
            marginHorizontal: 8,
            marginVertical: 2,
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="camera"
          options={{
            drawerLabel: "Camera",
            title: "Camera",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="camera-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="location"
          options={{
            drawerLabel: "Location",
            title: "Location",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="location-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="contacts"
          options={{
            drawerLabel: "Contacts",
            title: "Contacts",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="clipboard"
          options={{
            drawerLabel: "Clipboard",
            title: "Clipboard",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
        {/* Hidden from drawer menu but still a valid route */}
        <Drawer.Screen
          name="preview"
          options={{ drawerItemStyle: { display: "none", height: 0 } }}
        />
        <Drawer.Screen
          name="survey-detail"
          options={{ drawerItemStyle: { display: "none", height: 0 } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
