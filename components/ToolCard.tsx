import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";
import GlassCard from "./GlassCard";

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
    <GlassCard
      outerCardStyle={[tw`border-white/15 border  `, { width }]}
      lightColor={Colors.primary}
      intensity={60}
      style={tw`p-3 py-4`}
      onPress={onPress}
      tint="dark"
      roundedClassName="rounded-lg"
    >
      <View style={tw`flex-col items-left`}>
        <View style={tw`bg-white/5 rounded-full p-4 mb-4 self-start`}>
          {icon}
        </View>
        <Text style={tw`text-white font-tussi-bold text-sm mb-2 text-left`}>
          {title}
        </Text>
        <Text
          style={tw`text-white/60 font-mont text-xs text-left`}
          numberOfLines={3}
        >
          {description}
        </Text>
      </View>
    </GlassCard>
  );
}
