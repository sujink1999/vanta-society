import tw from "@/constants/tw";
import { Exercise, WeightUnit, Set as WorkoutSet } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, TouchableOpacity, View } from "react-native";
import { PlatformBlurView } from "../PlatformBlurView";
import { SetRow } from "./SetRow";

interface ExerciseInputProps {
  exercise: Exercise;
  onUpdate: (updates: Partial<Exercise>) => void;
  onRemove: () => void;
}

export function ExerciseInput({
  exercise,
  onUpdate,
  onRemove,
}: ExerciseInputProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const contentHeightRef = useRef(0);

  // Get current unit from first set, default to lbs
  const currentUnit: WeightUnit = exercise.sets[0]?.unit || "lbs";

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const addSet = () => {
    const newSet: WorkoutSet = {
      reps: 0,
      weight: 0,
      unit: currentUnit,
    };
    onUpdate({
      sets: [...exercise.sets, newSet],
    });
  };

  const updateSet = (index: number, updatedSet: WorkoutSet) => {
    const newSets = [...exercise.sets];
    newSets[index] = updatedSet;
    onUpdate({ sets: newSets });
  };

  const removeSet = (index: number) => {
    if (exercise.sets.length === 1) return; // Keep at least 1 set
    onUpdate({
      sets: exercise.sets.filter((_, i) => i !== index),
    });
  };

  const changeWeightUnit = (unit: WeightUnit) => {
    // Update all sets to use the new unit
    const updatedSets = exercise.sets.map((set) => ({
      ...set,
      unit,
    }));
    onUpdate({ sets: updatedSets });
  };

  return (
    <PlatformBlurView
      intensity={20}
      tint="light"
      style={tw`rounded-lg overflow-hidden border border-white/20 mb-3`}
    >
      {/* Exercise Name Header with Collapse Icon */}
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={tw`flex-row items-center gap-2 bg-black/20 p-4`}
        activeOpacity={0.7}
      >
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-mont-medium text-sm`}>
            {exercise.name}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="white"
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          {
            overflow: "hidden",
            opacity: animatedHeight,
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
          },
        ]}
      >
        <View>
          {/* Table Header: Reps, Weight, Unit Selector */}
          <View style={tw`flex-row items-center px-4 pt-2 `}>
            <View style={tw`w-6`}></View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white/80 font-mont text-xs`}>Reps</Text>
            </View>
            <View style={tw`flex-1 flex-row items-center gap-2`}>
              <Text style={tw`text-white/80 font-mont text-xs `}>Weight</Text>
              {/* Unit Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  changeWeightUnit(currentUnit === "kg" ? "lbs" : "kg")
                }
                style={[tw`px-4 py-1 bg-black/40 rounded-md`]}
              >
                <Text style={tw`font-mont-medium text-sm text-white`}>
                  {currentUnit}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={tw`w-8`} />
          </View>

          {/* Sets */}
          <View style={tw`px-4 py-2`}>
            {exercise.sets.map((set, index) => (
              <SetRow
                key={index}
                setNumber={index + 1}
                set={set}
                onChange={(updatedSet) => updateSet(index, updatedSet)}
                onRemove={() => removeSet(index)}
              />
            ))}
          </View>

          {/* Add Set and Delete Exercise Buttons */}
          <View style={tw`px-4 pb-3 flex-row gap-2`}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                addSet();
              }}
              style={({ pressed }) => [
                tw`flex-1 rounded-md bg-white/10 px-3 py-2`,
                pressed && tw`opacity-70`
              ]}
            >
              <Text
                style={tw`text-white font-mont-semibold text-sm text-center`}
              >
                + Add Set
              </Text>
            </Pressable>
            <TouchableOpacity
              onPress={onRemove}
              style={tw`rounded-md bg-white/10 px-3 py-2`}
            >
              <Ionicons name="trash-outline" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </PlatformBlurView>
  );
}
