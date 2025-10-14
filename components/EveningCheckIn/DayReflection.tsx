import tw from "@/constants/tw";
import React from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface DayReflectionProps {
  fadeAnim: Animated.Value;
  selectedMood: string | null;
  onSelectMood: (mood: string) => void;
  journal: string;
  onChangeJournal: (text: string) => void;
  weight: string;
  onChangeWeight: (text: string) => void;
  weightUnit: "kg" | "lbs";
  onChangeWeightUnit: (unit: "kg" | "lbs") => void;
  imageUris: string[];
  onPickImage: () => void;
  onRemoveImage: (index: number) => void;
}

const MOOD_OPTIONS = [
  { id: "fire", label: "On Fire", icon: "🔥" },
  { id: "good", label: "Good", icon: "😊" },
  { id: "okay", label: "Okay", icon: "😐" },
  { id: "tough", label: "Tough", icon: "😔" },
  { id: "tired", label: "Tired", icon: "😴" },
];

export function DayReflection({
  fadeAnim,
  selectedMood,
  onSelectMood,
  journal,
  onChangeJournal,
  weight,
  onChangeWeight,
  weightUnit,
  onChangeWeightUnit,
  imageUris,
  onPickImage,
  onRemoveImage,
}: DayReflectionProps) {
  return (
    <Animated.View
      style={[tw`flex  min-h-[500px] px-2 pt-2`, { opacity: fadeAnim }]}
    >
      <Text style={tw`text-white font-tussi-bold text-lg mb-4`}>
        Reflect on your day
      </Text>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Selection */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/60 font-mont text-sm mb-6`}>
            Select your mood
          </Text>

          <View style={tw`flex-row flex-wrap justify-between gap-4`}>
            {MOOD_OPTIONS.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableWithoutFeedback
                  key={mood.id}
                  onPress={() => onSelectMood(mood.id)}
                  style={[tw`items-center justify-center `]}
                >
                  <Text
                    style={tw`text-white font-mont text-4xl ${
                      isSelected ? "opacity-100" : "opacity-50 scale-90"
                    }`}
                  >
                    {MoodIcon}
                  </Text>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </View>

        {/* Journal Entry */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/60 font-mont text-sm mb-4`}>
            Daily Journal (optional)
          </Text>

          <TextInput
            style={tw`bg-white/5 border border-white/10 rounded-sm p-2 px-3 text-white font-mont text-base min-h-40`}
            placeholder="How was your day? What are you thankful for?"
            placeholderTextColor="#979797"
            multiline
            textAlignVertical="top"
            value={journal}
            onChangeText={onChangeJournal}
          />
        </View>

        {/* Weight Entry */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-white/60 font-mont text-sm mb-4`}>
            Track Weight (optional)
          </Text>

          <View style={tw`flex-row items-center gap-2`}>
            <TextInput
              style={tw`flex-1 bg-white/5 border border-white/10 rounded-sm p-[6px] px-3 text-white font-mont text-base`}
              placeholder="Enter weight"
              placeholderTextColor="#979797"
              value={weight}
              onChangeText={onChangeWeight}
              keyboardType="decimal-pad"
            />

            <View
              style={tw`flex-row bg-white/5 border border-white/10 rounded-sm overflow-hidden`}
            >
              <TouchableOpacity
                onPress={() => onChangeWeightUnit("kg")}
                style={[tw`px-4 py-2`, weightUnit === "kg" && tw`bg-white/10`]}
              >
                <Text
                  style={[
                    tw`font-mont-medium text-sm`,
                    weightUnit === "kg" ? tw`text-white` : tw`text-white/50`,
                  ]}
                >
                  kg
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onChangeWeightUnit("lbs")}
                style={[
                  tw`px-4 py-2 border-l border-white/10`,
                  weightUnit === "lbs" && tw`bg-white/10`,
                ]}
              >
                <Text
                  style={[
                    tw`font-mont-medium text-sm`,
                    weightUnit === "lbs" ? tw`text-white` : tw`text-white/50`,
                  ]}
                >
                  lbs
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Photo Attachments */}
        <View>
          <Text style={tw`text-white/60 font-mont text-sm mb-6`}>
            Capture your journey (optional, max 5)
          </Text>

          <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
            {imageUris.map((uri, index) => (
              <View key={index} style={tw`relative`}>
                <Image
                  source={{ uri }}
                  style={tw`w-28 h-28 rounded-md`}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => onRemoveImage(index)}
                  style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}
                >
                  <Text style={tw`text-white font-mont-bold text-xs`}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {imageUris.length < 5 && (
              <TouchableOpacity
                onPress={onPickImage}
                style={tw`w-28 h-28 bg-white/5 border-2 border-dashed border-white/20 rounded-md items-center justify-center`}
              >
                <Text style={tw`text-white/60 text-4xl mb-1`}>+</Text>
                <Text style={tw`text-white/60 font-mont text-xs`}>
                  Add Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={tw`text-white/60 font-mont text-xs text-center mb-6`}>
            Your images are not uploaded to the cloud and only you can see them.
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
