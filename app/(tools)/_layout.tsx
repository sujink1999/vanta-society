import { Stack } from "expo-router";

export default function ToolsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "#000000",
        },
      }}
    >
      <Stack.Screen name="deep-focus" />
    </Stack>
  );
}
