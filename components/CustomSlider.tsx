import tw from "@/constants/tw";
import Slider from "@react-native-community/slider";
import React from "react";
import { Text, View } from "react-native";

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
}

export function CustomSlider({
  min,
  max,
  step,
  value,
  onValueChange,
}: CustomSliderProps) {
  return (
    <View style={tw`flex-row items-center gap-6`}>
      {/* Slider */}
      <View style={tw`flex-1`}>
        <Slider
          style={{ width: "100%", height: 20 }}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#FF5C2A"
          maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
          thumbTintColor="white"
        />
      </View>

      {/* Current Value Display */}
      <View style={tw`flex-row justify-center items-center`}>
        <Text style={tw`text-white font-mont-medium text-3xl `}>{value}</Text>
      </View>
    </View>
  );
}
