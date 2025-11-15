import { ChevronLeftIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useRouter } from "expo-router";
import React from "react";
import GlassCard from "./GlassCard";

interface BackButtonProps {
  onPress?: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <GlassCard
      onPress={handlePress}
      outerCardStyle={tw` ml-3 mt-3 self-start`}
      style={tw`p-2`}
      intensity={30}
      tint="dark"
      lightColor={"white"}
      hapticStyle="light"
      enableHaptics={true}
      enableSound={true}
      lightSize={40}
    >
      <ChevronLeftIcon size={20} color="white" />
    </GlassCard>
  );
}
