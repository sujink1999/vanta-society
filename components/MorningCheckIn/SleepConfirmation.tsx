import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import React from "react";
import { Animated, Text, View } from "react-native";
import { SleepIcon } from "../icons/TaskIcons";

interface SleepConfirmationProps {
  fadeAnim: Animated.Value;
}

export function SleepConfirmation({ fadeAnim }: SleepConfirmationProps) {
  return (
    <Animated.View
      style={[
        tw`justify-center items-center min-h-[250px] px-3`,
        { opacity: fadeAnim },
      ]}
    >
      <View style={tw`flex-1`} />
      <SleepIcon size={48} color={Colors.white} />
      <Text style={tw`text-white font-tussi text-xl text-center mb-8 mt-4`}>
        Did you sleep for 8 hours?
      </Text>
      <View style={tw`flex-1`} />
    </Animated.View>
  );
}
