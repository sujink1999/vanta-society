import tw from "@/constants/tw";
import React from "react";
import { View } from "react-native";

interface StoryProgressBarProps {
  totalSteps: number;
  currentStep: number;
  style?: any;
}

export function StoryProgressBar({
  totalSteps,
  currentStep,
  style,
}: StoryProgressBarProps) {
  return (
    <View style={[tw`flex-row gap-1`, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        let boxStyle;
        if (index < currentStep) {
          // Completed - primary color
          boxStyle = tw`bg-primary`;
        } else if (index === currentStep) {
          // Current - primary color
          boxStyle = tw`bg-primary`;
        } else {
          // Future - muted color
          boxStyle = tw`bg-white/20`;
        }

        return (
          <View
            key={index}
            style={[tw`flex-1 h-[6px] rounded-full`, boxStyle]}
          />
        );
      })}
    </View>
  );
}
