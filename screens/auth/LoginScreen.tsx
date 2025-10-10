import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { refetchUser } = useGlobalContext();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Pulsing fade animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const handleGoogleSignInSuccess = async (user: any, response: any) => {
    try {
      setIsLoading(true);

      // Refetch user data to update context
      await refetchUser(true);
    } catch (error) {
      console.error("Error after sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInError = (error: string) => {};

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw`flex-1  px-6`}>
        <View style={tw`flex-1`} />

        <View style={tw`flex-3 flex-col justify-between`}>
          <View style={tw` flex flex-col items-center gap-1`}>
            <Animated.Image
              source={require("@/assets/images/society-logo-no-bg.png")}
              style={[tw`w-40 h-20 mb-10`, { opacity: fadeAnim }]}
              resizeMode="contain"
            />
            <Text
              style={tw`text-textSecondary text-center font-mont-medium text-lg`}
            >
              welcome to
            </Text>
            <GradientText
              style={tw`text-textPrimary text-center font-tussi-bold text-11`}
            >
              SOCIETY
            </GradientText>
          </View>

          <View style={tw` flex flex-col items-center gap-4`}>
            <Text
              style={tw`text-textSecondary text-center font-mont-medium text-sm`}
            >
              from <Text style={tw`font-tussi-bold `}>VANTA</Text>
            </Text>

            <Text
              style={tw`text-textPrimary text-center font-mont-medium text-sm mb-10`}
            >
              for the 1% - and those who are becoming
            </Text>
            <View style={tw`mb-10 h-14`}>
              <GoogleSignInButton
                onSuccess={handleGoogleSignInSuccess}
                onError={handleGoogleSignInError}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
