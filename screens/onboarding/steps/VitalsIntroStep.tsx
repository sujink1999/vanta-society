import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";

interface VitalsIntroStepProps {
  onNext: () => void;
  loading?: boolean;
}

export function VitalsIntroStep({ onNext, loading }: VitalsIntroStepProps) {
  return (
    <View style={tw`flex-1 px-6 py-8`}>
      {/* Intro Screen */}
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-white font-tussi-bold text-lg text-center mb-2`}>
          VITALS SCORE
        </Text>
        <Text
          style={tw`text-textSecondary font-mont text-base text-center mb-8 leading-6`}
        >
          Get your baseline based on your answers
        </Text>
        {/* Image placeholder */}
        <View
          style={tw`w-64 h-64 bg-white/10 rounded-lg mb-12 items-center justify-center`}
        >
          <Text style={tw`text-white/50 font-tussi text-sm`}>
            Vitals Image
          </Text>
        </View>
        <Button
          title="GENERATE YOUR VITALS SCORE"
          onPress={onNext}
          loading={loading}
          textStyle={tw`text-xs`}
          style={tw`w-full`}
        />
      </View>
    </View>
  );
}