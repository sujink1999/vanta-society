import { Button } from "@/components/Button";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import React from "react";
import { Animated, Text, View } from "react-native";
import { SleepIcon } from "../icons/TaskIcons";

interface SleepConfirmationProps {
  fadeAnim: Animated.Value;
  onYes: () => void;
  onNo: () => void;
}

export function SleepConfirmation({
  fadeAnim,
  onYes,
  onNo,
}: SleepConfirmationProps) {
  return (
    <Animated.View
      style={[
        tw`justify-center items-center min-h-[250px]`,
        { opacity: fadeAnim },
      ]}
    >
      <View style={tw`flex-1`} />
      <SleepIcon size={48} color={Colors.white} />
      <Text style={tw`text-white font-tussi text-xl text-center mb-8 mt-4`}>
        Did you sleep for 8 hours?
      </Text>
      <View style={tw`flex-1`} />

      <View style={tw`w-full flex-row gap-3`}>
        <View style={tw`flex-1`}>
          <Button title="No" onPress={onNo} style={tw`bg-white/10`} />
        </View>
        <View style={tw`flex-1`}>
          <Button title="Yes" onPress={onYes} />
        </View>
      </View>
    </Animated.View>
  );
}
