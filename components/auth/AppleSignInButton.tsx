import tw from "@/constants/tw";
import { appleSignIn } from "@/services/api/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, View } from "react-native";

interface AppleSignInButtonProps {
  onSuccess?: (user: any, response: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function AppleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: AppleSignInButtonProps) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if Apple Sign In is available (iOS 13+ only)
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync().then((result) => {
        console.log("Apple Sign In available:", result);
        setIsAvailable(result);
      });
    }
  }, []);

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send identity token to backend
      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      const response = await appleSignIn({
        identityToken: credential.identityToken,
      });

      if (response.success) {
        onSuccess?.(response.data.user, response);
      } else {
        onError?.(response.error || "Apple Sign-in failed");
        Alert.alert("Error", response.error || "Apple Sign-in failed");
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // User canceled the sign-in flow
        setLoading(false);
        return;
      }

      const errorMessage = e.message || "Apple Sign-in failed";
      onError?.(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not available (non-iOS or iOS < 13)
  if (!isAvailable) {
    return null;
  }

  if (loading) {
    return (
      <View
        style={tw`w-full h-11 bg-white rounded-lg flex-row items-center justify-center`}
      >
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
      cornerRadius={8}
      style={tw`w-full h-11`}
      onPress={handleAppleSignIn}
    />
  );
}
