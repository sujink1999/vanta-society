import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: '#000000' } }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}