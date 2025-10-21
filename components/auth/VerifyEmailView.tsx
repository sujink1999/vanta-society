import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface VerifyEmailViewProps {
  email: string;
  otp: string;
  onOtpChange: (text: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBackToSignIn: () => void;
  loading: boolean;
}

export function VerifyEmailView({
  email,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  onBackToSignIn,
  loading,
}: VerifyEmailViewProps) {
  return (
    <View style={tw`flex-col gap-4`}>
      <Text style={tw`text-white font-tussi-bold text-lg mb-4`}>
        Verify Email
      </Text>

      <Text style={tw`text-white/70 font-mont text-sm mb-2`}>
        We&apos;ve sent a 6-digit verification code to {email}
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

      <Button
        title="Verify Email"
        onPress={onVerify}
        loading={loading}
        style={{ backgroundColor: "#FF5C2A" }}
      />

      <View style={tw`flex-row justify-center items-center gap-1`}>
        <Text style={tw`text-white/70 font-mont text-sm`}>
          Didn&apos;t receive code?
        </Text>
        <TouchableOpacity onPress={onResend} disabled={loading}>
          <Text style={tw`text-primary font-mont-semibold text-sm`}>
            Resend
          </Text>
        </TouchableOpacity>
      </View>

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
