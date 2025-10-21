import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface ForgotPasswordViewProps {
  email: string;
  onEmailChange: (text: string) => void;
  onSendCode: () => void;
  onBackToSignIn: () => void;
  loading: boolean;
}

export function ForgotPasswordView({
  email,
  onEmailChange,
  onSendCode,
  onBackToSignIn,
  loading,
}: ForgotPasswordViewProps) {
  return (
    <View style={tw`flex-col gap-4`}>
      <Text style={tw`text-white font-tussi-bold text-lg mb-4`}>
        Forgot Password
      </Text>

      <Text style={tw`text-white/70 font-mont text-sm mb-2`}>
        Enter your email to receive a password reset code
      </Text>

      <TextInput
        style={tw`bg-white/5 border border-white/5 rounded-sm px-4 py-3 text-white font-mont`}
        placeholder="Email"
        placeholderTextColor="#979797"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <Button
        title="Send Reset Code"
        onPress={onSendCode}
        loading={loading}
        style={{ backgroundColor: "#FF5C2A" }}
      />

      <TouchableOpacity
        onPress={onBackToSignIn}
        disabled={loading}
        style={tw`mt-2`}
      >
        <Text style={tw`text-white/70 font-mont text-sm text-center`}>
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
