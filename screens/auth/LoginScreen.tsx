import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { EmailAuthModal } from "@/components/EmailAuthModal";
import { GradientText } from "@/components/GradientText";
import { MailIcon } from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
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

  const handleGoogleSignInSuccess = async () => {
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

  const handleGoogleSignInError = () => {};

  const handleEmailAuthSuccess = async () => {
    try {
      setIsLoading(true);

      // Refetch user data to update context
      await refetchUser(true);
    } catch (error) {
      console.error("Error after email sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

            <View style={tw`flex-col h-30 gap-1 w-full`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setEmailModalVisible(true)}
                style={tw`w-full bg-white/10 border rounded-lg px-4 py-3 flex-row items-center gap-2 justify-center `}
              >
                <MailIcon size={24} color={Colors.textSecondary} />
                <Text style={tw`text-base font-mont text-white ml-2`}>
                  Sign in with Email
                </Text>
              </TouchableOpacity>
              <GoogleSignInButton
                onSuccess={handleGoogleSignInSuccess}
                onError={handleGoogleSignInError}
                disabled={isLoading}
              />
            </View>
          </View>
        </View>
      </View>

      <EmailAuthModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        onSuccess={handleEmailAuthSuccess}
      />
    </SafeAreaView>
  );
}
