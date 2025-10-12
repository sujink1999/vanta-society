import { Colors } from "@/constants/theme";
import { useAppActivityTracker } from "@/hooks/useAppActivityTracker";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  useAppActivityTracker();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: "#000000",
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "transparent",
          // borderRightWidth: 1,
          // borderLeftWidth: 1,
          borderColor: "#ffffff30",
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
          position: "absolute",
          overflow: "hidden",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={20}
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
          />
        ),
        tabBarItemStyle: {
          paddingTop: 10,
        },
        headerShown: false,
      }}
      safeAreaInsets={{
        bottom: 30,
      }}
    >
      <Tabs.Screen
        name="winterarc"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
              <Ionicons name="snow" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
              <Ionicons name="storefront" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
              <Ionicons name="people" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
              <Ionicons name="construct" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
