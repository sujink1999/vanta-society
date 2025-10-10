import { Stack } from "expo-router";

export default function WinterArcLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
