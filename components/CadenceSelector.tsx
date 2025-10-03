import tw from "@/constants/tw";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CadenceSelectorProps {
  cadence: number[];
  onChange: (newCadence: number[]) => void;
  accentColor: string;
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CadenceSelector({
  cadence,
  onChange,
  accentColor,
}: CadenceSelectorProps) {
  const toggleDay = (dayIndex: number) => {
    const newCadence = [...cadence];
    newCadence[dayIndex] = newCadence[dayIndex] === 1 ? 0 : 1;
    onChange(newCadence);
  };

  return (
    <View style={tw`flex-row gap-2`}>
      {DAYS.map((day, index) => {
        const isSelected = cadence[index] === 1;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => toggleDay(index)}
            style={[
              tw`w-8 h-8 rounded-md border items-center justify-center`,
              {
                borderColor: isSelected ? accentColor : "#666",
                backgroundColor: isSelected
                  ? `${accentColor}20`
                  : "transparent",
              },
            ]}
          >
            <Text
              style={[
                tw`font-mont-medium text-sm`,
                { color: isSelected ? accentColor : "#666" },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
