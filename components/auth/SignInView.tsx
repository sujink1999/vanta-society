import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SignInViewProps {
  email: string;
  password: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onContinue: () => void;
  onForgotPassword: () => void;
  loading: boolean;
}

export function SignInView({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onContinue,
  onForgotPassword,
  loading,
}: SignInViewProps) {
  return (
    <View style={tw`flex-col gap-4`}>
      <Text style={tw`text-white font-tussi-bold text-lg mb-4`}>Sign In</Text>

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

      <TextInput
        style={tw`bg-white/5 border border-white/5 rounded-sm px-4 py-3 text-white font-mont`}
        placeholder="Password (min 8 characters)"
        placeholderTextColor="#979797"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity onPress={onForgotPassword} disabled={loading}>
        <Text style={tw`text-primary font-mont text-sm text-right mb-8`}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <Button
        title="Continue"
        onPress={onContinue}
        loading={loading}
        style={{ backgroundColor: "#FF5C2A" }}
      />

      <Text style={tw`text-white/50 font-mont text-xs text-center`}>
        We&apos;ll sign you in or create an account automatically
      </Text>
    </View>
  );
}
