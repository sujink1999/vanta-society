import { useFonts } from 'expo-font';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    // TussiLago fonts from local assets
    TussilagoExtraLight: require('@/assets/fonts/TussilagoExtraLight.otf'),
    TussilagoLight: require('@/assets/fonts/TussilagoLight.otf'),
    TussilagoRegular: require('@/assets/fonts/TussilagoRegular.ttf'),
    TussilagoBold: require('@/assets/fonts/TussilagoBold.otf'),
    TussilagoHeavy: require('@/assets/fonts/TussilagoHeavy.otf'),

    // Montserrat from Google Fonts
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  return fontsLoaded;
}