import tw from "@/constants/tw";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        tw`py-3 px-4 rounded-sm font-tussi-bold  text-sm bg-primary flex justify-center items-center `,
        isDisabled && tw`opacity-50`,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[tw`text-white font-tussi-bold`, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
