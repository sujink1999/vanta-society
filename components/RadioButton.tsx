import tw from "@/constants/tw";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

export function RadioButton({
  options,
  selectedValue,
  onValueChange,
  style,
}: RadioButtonProps) {
  return (
    <View style={[tw`flex-row justify-between`, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={tw`flex-row items-center flex-1 mx-1`}
          onPress={() => onValueChange(option.value)}
        >
          <View
            style={[
              tw`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center`,
              selectedValue === option.value
                ? tw`border-white/20`
                : tw`border-white/20`,
            ]}
          >
            {selectedValue === option.value && (
              <View style={tw`w-2.5 h-2.5 rounded-full bg-primary`} />
            )}
          </View>
          <Text style={tw`text-white font-tussi text-sm flex-1`}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
