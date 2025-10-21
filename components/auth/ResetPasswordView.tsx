import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface ResetPasswordViewProps {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
  onOtpChange: (text: string) => void;
  onNewPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  onReset: () => void;
  onBackToSignIn: () => void;
  loading: boolean;
}

export function ResetPasswordView({
  email,
  otp,
  newPassword,
  confirmPassword,
  onOtpChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onReset,
  onBackToSignIn,
  loading,
}: ResetPasswordViewProps) {
  return (
    <View style={tw`flex-col gap-2`}>
      <Text style={tw`text-white font-tussi-bold text-lg mb-4`}>
        Reset Password
      </Text>

      <Text style={tw`text-white/70 font-mont text-sm mb-6`}>
        Enter the code sent to {email} and your new password
      </Text>

      <TextInput
        style={tw`bg-white/5 border border-white/5 rounded-sm px-4 py-3 text-white font-mont text-center text-lg tracking-widest`}
        placeholder="000000"
        placeholderTextColor="#979797"
        value={otp}
        onChangeText={onOtpChange}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TextInput
        style={tw`bg-white/5 border border-white/5 rounded-sm px-4 py-3 text-white font-mont`}
        placeholder="New Password (min 8 characters)"
        placeholderTextColor="#979797"
        value={newPassword}
        onChangeText={onNewPasswordChange}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={tw`bg-white/5 border border-white/5 rounded-sm px-4 py-3 text-white font-mont mb-4`}
        placeholder="Confirm New Password"
        placeholderTextColor="#979797"
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        secureTextEntry
        editable={!loading}
      />

      <Button
        title="Reset Password"
        onPress={onReset}
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
