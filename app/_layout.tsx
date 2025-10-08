import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useAppFonts } from '@/constants/useFonts';
import { GlobalProvider } from '@/contexts/GlobalContext';
import AuthNavigator from '@/components/AuthNavigator';
import { NotificationContainer } from '@/components/NotificationContainer';
import { dataSyncManager } from '@/services/storage/DataSyncManager';
import { checkInStorageManager } from '@/services/storage/CheckInStorageManager';
import { useEffect } from 'react';

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  // Initialize storage managers on app startup
  useEffect(() => {
    dataSyncManager.initialize();
    checkInStorageManager.initialize();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Loading Vanta Society...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <GlobalProvider>
        <AuthNavigator>
          <Stack screenOptions={{ contentStyle: { backgroundColor: '#000000' } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(winterarc)" options={{ headerShown: false }} />
          </Stack>
        </AuthNavigator>
        <NotificationContainer />
      </GlobalProvider>
    </View>
  );
}
