import tw from "@/constants/tw";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

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
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset to 0 and animate to full width when currentStep changes
    widthAnim.setValue(0);
    Animated.timing(widthAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [currentStep, widthAnim]);

  return (
    <View style={[tw`flex-row gap-1`, style]}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        let boxStyle;
        const isCurrent = index === currentStep;

        if (index < currentStep) {
          // Completed - primary color
          boxStyle = tw`bg-primary`;
        } else if (isCurrent) {
          // Current - primary color
          boxStyle = tw`bg-primary`;
        } else {
          // Future - muted color
          boxStyle = tw`bg-white/20`;
        }

        if (isCurrent) {
          return (
            <View
              key={index}
              style={tw`flex-1 h-[6px] overflow-hidden bg-white/20`}
            >
              <Animated.View
                style={[
                  tw`h-full rounded-full `,
                  boxStyle,
                  {
                    transform: [{ scaleX: widthAnim }],
                    transformOrigin: "left",
                  },
                ]}
              />
            </View>
          );
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
