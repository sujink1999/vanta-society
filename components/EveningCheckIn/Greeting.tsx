import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import React from "react";
import { Animated, Text } from "react-native";

interface GreetingProps {
  fadeAnim: Animated.Value;
  firstName?: string;
}

export function Greeting({ fadeAnim, firstName }: GreetingProps) {
  return (
    <Animated.View
      style={[
        tw`justify-center items-center px-6 min-h-[250px]`,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={tw`text-white/60 font-mont text-lg mb-4`}>
        Good evening,
      </Text>
      <GradientText style={tw`text-white font-tussi text-5xl`}>
        {firstName || "Champion"}
      </GradientText>
      <Text style={tw`text-white/60 font-mont text-lg mt-10`}>
        Let&apos;s wrap up your day
      </Text>
    </Animated.View>
  );
}
