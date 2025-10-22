import tw from "@/constants/tw";
import { GoogleAuthService } from "@/services/auth/GoogleAuthService";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import GoogleIcon from "@/assets/images/google-icon.png";

interface GoogleSignInButtonProps {
  onSuccess?: (user: any, response: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    const result = await GoogleAuthService.signIn();

    if (result.success) {
      onSuccess?.(result.user, result.response);
    } else {
      onError?.(result.error || "Sign-in failed");
    }

    setLoading(false);
  };

  return (
    <TouchableOpacity
      style={tw`w-full bg-white rounded-lg px-4 py-3 flex-row items-center justify-center `}
      onPress={handleSignIn}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={tw` py-[2px] flex-row items-center justify-center`}>
          <ActivityIndicator size="small" color="black" />
        </View>
      ) : (
        <>
          <Image
            source={GoogleIcon}
            style={tw`w-4 h-4 mr-2`}
            resizeMode="contain"
          />
          <Text style={tw`text-base font-medium text-black`}>
            Sign in with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
