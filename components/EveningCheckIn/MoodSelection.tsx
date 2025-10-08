import {
  FireIcon,
  HappyIcon,
  NeutralIcon,
  SadIcon,
  StrongIcon,
  TiredIcon,
} from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface MoodSelectionProps {
  fadeAnim: Animated.Value;
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
}

const MOOD_OPTIONS = [
  { id: "fire", label: "On Fire", icon: FireIcon },
  { id: "strong", label: "Strong", icon: StrongIcon },
  { id: "good", label: "Good", icon: HappyIcon },
  { id: "okay", label: "Okay", icon: NeutralIcon },
  { id: "tough", label: "Tough", icon: SadIcon },
  { id: "tired", label: "Tired", icon: TiredIcon },
];

export function MoodSelection({
  fadeAnim,
  selectedMood,
  onSelectMood,
}: MoodSelectionProps) {
  return (
    <Animated.View
      style={[tw`justify-center px-6 py-6`, { opacity: fadeAnim }]}
    >
      <Text style={tw`text-white font-tussi-bold text-2xl mb-2 text-center`}>
        How was your day?
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm mb-8 text-center`}>
        Select your mood
      </Text>

      <View style={tw`flex-row flex-wrap justify-center gap-4 pb-6`}>
        {MOOD_OPTIONS.map((mood) => {
          const MoodIcon = mood.icon;
          const isSelected = selectedMood === mood.id;
          return (
            <TouchableOpacity
              key={mood.id}
              onPress={() => onSelectMood(mood.id)}
              style={[
                tw`items-center justify-center w-20 h-20 rounded-full`,
                isSelected
                  ? tw`bg-primary/20 border-2 border-primary`
                  : tw`bg-white/5 border border-white/10`,
              ]}
            >
              <MoodIcon
                size={32}
                color={isSelected ? Colors.primary : "#979797"}
              />
              <Text
                style={[
                  tw`font-mont text-xs mt-2`,
                  isSelected ? tw`text-primary` : tw`text-white/60`,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}
