import { PlatformBlurView } from "@/components/PlatformBlurView";
import { ExerciseModal } from "@/components/workout/ExerciseModal";
import { COMMON_EXERCISES } from "@/constants/exercises";
import tw from "@/constants/tw";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (exerciseName: string) => void;
  exerciseHistory: string[];
  currentExerciseNames?: string[]; // Already selected exercises in current workout
}

export function ExerciseSelectionModal({
  visible,
  onClose,
  onSelect,
  exerciseHistory,
  currentExerciseNames = [],
}: ExerciseSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(name);
    setSearchQuery("");
    onClose();
  };

  // Merge custom exercises (from history) with common exercises (deduplicated)
  const allExercises = [...new Set([...exerciseHistory, ...COMMON_EXERCISES])];

  // Filter out already selected exercises
  const availableExercises = allExercises.filter(
    (ex) => !currentExerciseNames.includes(ex)
  );

  // Initial view: show 10 most recent from history (that aren't already selected)
  const initialExercises = exerciseHistory
    .filter((ex) => !currentExerciseNames.includes(ex))
    .slice(0, 10);

  // Filter exercises based on search (show recent 10 if no search query)
  const filteredExercises = searchQuery
    ? availableExercises.filter((ex) =>
        ex.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : initialExercises;

  // Check if search query starts with any exercise (case-insensitive)
  const hasStartsWithMatch = allExercises.some((ex) =>
    ex.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  // Show "Add custom" option if there's a search query and no starts-with match
  const showCustomOption =
    searchQuery.trim() && !hasStartsWithMatch && searchQuery.trim().length > 3;

  return (
    <ExerciseModal
      visible={visible}
      onClose={onClose}
      style={tw`rounded-md overflow-hidden border border-white/20`}
    >
      <View style={tw`p-3 pb-0 min-h-[350px]`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-4 pl-3`}>
          <Text style={tw`text-white font-tussi text-sm`}>Add Exercise</Text>
          <TouchableOpacity onPress={onClose} style={tw`p-1`}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={tw`mb-2`}>
          <TextInput
            style={tw`bg-black/30 h-12 text-white border border-white/10 font-mont text-base px-4  rounded-md`}
            placeholder="Exercise Name"
            placeholderTextColor="#979797"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            autoCapitalize="none"
          />
        </View>

        {/* Exercise List */}
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          {/* Custom option */}
          {showCustomOption && (
            <TouchableOpacity
              onPress={() => handleSelect(searchQuery.trim())}
              style={tw`mb-2`}
            >
              <PlatformBlurView
                intensity={30}
                tint="dark"
                style={tw`rounded-md overflow-hidden bg-white/5 border border-white/5`}
              >
                <View style={tw`p-4 flex-row items-center gap-3`}>
                  <View
                    style={tw`w-10 h-10 rounded-full bg-primary/20 items-center justify-center`}
                  >
                    <Ionicons name="add" size={24} color="#FF5C2A" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white font-mont-semibold text-base`}>
                      Add &quot;{searchQuery.trim()}&quot;
                    </Text>
                    <Text style={tw`text-white/60 font-mont text-sm`}>
                      Custom exercise
                    </Text>
                  </View>
                </View>
              </PlatformBlurView>
            </TouchableOpacity>
          )}

          {/* Filtered exercises */}
          {filteredExercises.length > 0
            ? filteredExercises.map((exercise, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(exercise)}
                  style={tw`mb-2`}
                >
                  <View
                    style={tw`rounded-md overflow-hidden bg-white/5 border border-white/5 `}
                  >
                    <View style={tw`p-3 px-4 flex-row items-center gap-3`}>
                      <Text style={tw`text-white font-mont text-base flex-1`}>
                        {exercise}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : !showCustomOption && (
                <View style={tw`py-8 items-center`}>
                  <Text style={tw`text-white/60 font-mont text-sm text-center`}>
                    {searchQuery
                      ? "No exercises found"
                      : "Start typing to search exercises"}
                  </Text>
                </View>
              )}
        </ScrollView>
      </View>
    </ExerciseModal>
  );
}
