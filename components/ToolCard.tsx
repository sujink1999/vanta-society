import tw from "@/constants/tw";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  width: number;
}

export function ToolCard({
  icon,
  title,
  description,
  onPress,
  width,
}: ToolCardProps) {
  return (
    <TouchableOpacity
      style={[
        tw`bg-white/5 border border-white/5 rounded-md p-3 py-4 flex-col items-left`,
        { width },
      ]}
      onPress={onPress}
      activeOpacity={0.5}
    >
      <View style={tw`bg-white/5 rounded-full p-4 mb-4 self-start`}>
        {icon}
      </View>
      <Text style={tw`text-white font-tussi-bold text-base mb-2 text-left`}>
        {title}
      </Text>
      <Text
        style={tw`text-white/60 font-mont text-xs text-left`}
        numberOfLines={3}
      >
        {description}
      </Text>
    </TouchableOpacity>
  );
}
