import { FullScreenModal } from "@/components/FullScreenModal";
import tw from "@/constants/tw";
import { WorkoutSession } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface WorkoutDetailModalProps {
  visible: boolean;
  workout: WorkoutSession | null;
  onClose: () => void;
}

export function WorkoutDetailModal({
  visible,
  workout,
  onClose,
}: WorkoutDetailModalProps) {
  if (!workout) return null;

  const getWorkoutTypeLabel = () => {
    if (workout.type === "strength") return "Strength Training";
    if (workout.type === "cardio") {
      if (workout.cardioType) {
        return (
          workout.cardioType.charAt(0).toUpperCase() +
          workout.cardioType.slice(1)
        );
      }
      return "Cardio";
    }
    if (workout.type === "flexibility") {
      if (workout.flexibilityType) {
        return (
          workout.flexibilityType.charAt(0).toUpperCase() +
          workout.flexibilityType.slice(1)
        );
      }
      return "Flexibility";
    }
    if (workout.type === "sports") {
      if (workout.customSportsName) return workout.customSportsName;
      if (workout.sportsType) {
        return (
          workout.sportsType.charAt(0).toUpperCase() +
          workout.sportsType.slice(1)
        );
      }
      return "Sports";
    }
    return "Workout";
  };

  return (
    <FullScreenModal visible={visible} closeOnOutsidePress={onClose}>
      <View style={tw`p-4`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-white font-tussi text-lg`}>
              {workout.name || getWorkoutTypeLabel()}
            </Text>
            <Text style={tw`text-white/60 font-mont text-xs mt-1`}>
              {moment(workout.date).format("dddd, MMMM D, YYYY")}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={tw`p-1`}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-4 max-h-[400px]`}
        >
          {/* Workout Info */}
          <View style={tw`rounded-lg overflow-hidden bg-white/5 p-4 mb-3`}>
            <View style={tw`flex-row items-center gap-4 mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white/60 font-mont text-xs mb-1`}>
                  Type
                </Text>
                <Text style={tw`text-white font-mont text-sm`}>
                  {getWorkoutTypeLabel()}
                </Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white/60 font-mont text-xs mb-1`}>
                  Duration
                </Text>
                <Text style={tw`text-white font-mont text-sm`}>
                  {workout.duration} min
                </Text>
              </View>
            </View>

            {/* Cardio specific info */}
            {workout.type === "cardio" && (
              <View style={tw`flex-row items-center gap-4`}>
                {workout.distance && (
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white/60 font-mont text-xs mb-1`}>
                      Distance
                    </Text>
                    <Text style={tw`text-white font-mont text-sm`}>
                      {workout.distance} {workout.distanceUnit || "mi"}
                    </Text>
                  </View>
                )}
                {workout.pace && (
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white/60 font-mont text-xs mb-1`}>
                      Pace
                    </Text>
                    <Text style={tw`text-white font-mont text-sm`}>
                      {workout.pace}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Exercises (for strength workouts) */}
          {workout.type === "strength" &&
            workout.exercises &&
            workout.exercises.length > 0 && (
              <View>
                <Text style={tw`text-white/60 font-mont text-xs mb-2`}>
                  Exercises
                </Text>
                {workout.exercises?.map((exercise, idx) => (
                  <View
                    key={idx}
                    style={tw`rounded-lg overflow-hidden bg-white/5  p-3 mb-2`}
                  >
                    <Text style={tw`text-white font-mont-medium text-sm mb-2`}>
                      {exercise.name}
                    </Text>
                    {exercise.sets.map((set, setIdx) => (
                      <View
                        key={setIdx}
                        style={tw`flex-row items-center gap-3 py-1`}
                      >
                        <Text style={tw`text-white/60 font-mont text-xs w-12`}>
                          Set {setIdx + 1}
                        </Text>
                        <View style={tw`flex-row gap-4`}>
                          <Text style={tw`text-white font-mont text-xs`}>
                            {set.reps} reps
                          </Text>
                          {set.weight > 0 && (
                            <Text style={tw`text-white font-mont text-xs`}>
                              {set.weight} {set.unit || "lbs"}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

          {/* Notes */}
          {workout.notes && (
            <View
              style={tw`rounded-lg overflow-hidden bg-white/5 border border-white/10 p-4 mt-3`}
            >
              <Text style={tw`text-white/60 font-mont text-xs mb-2`}>
                Notes
              </Text>
              <Text style={tw`text-white font-mont text-sm`}>
                {workout.notes}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </FullScreenModal>
  );
}
