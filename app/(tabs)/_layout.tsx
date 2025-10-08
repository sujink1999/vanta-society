import {
  CommunityIcon,
  StoreIcon,
  ToolsIcon,
  WinterArcIcon,
} from "@/components/icons/TabIcons";
import { Colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { View } from "react-native";

const AnimatedTabIcon = ({
  IconComponent,
  focused,
  color,
}: {
  IconComponent: any;
  focused: boolean;
  color: string;
}) => {
  return (
    <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
      <IconComponent size={20} color={color} />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          backgroundColor: "transparent",
          // borderRightWidth: 1,
          // borderLeftWidth: 1,
          borderColor: "#ffffff20",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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
        bottom: 20,
      }}
    >
      <Tabs.Screen
        name="winterarc"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              IconComponent={WinterArcIcon}
              focused={focused}
              color={color}
              key="winterarc"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              IconComponent={StoreIcon}
              focused={focused}
              color={color}
              key="store"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              IconComponent={CommunityIcon}
              focused={focused}
              color={color}
              key="community"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              IconComponent={ToolsIcon}
              focused={focused}
              color={color}
              key="tools"
            />
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
