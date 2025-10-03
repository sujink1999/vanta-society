import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { refetchUser } = useGlobalContext();

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
        <View style={tw`flex-2`} />

        <View style={tw`flex-3 flex-col justify-between`}>
          <View style={tw` flex flex-col items-center gap-1`}>
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
