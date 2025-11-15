import { getTaskIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { WorkoutSession } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import GlassCard from "./GlassCard";

interface ActivitySectionProps {
  workouts: WorkoutSession[];
}

// Map workout types to task names (same as WorkoutTypeModal)
const WORKOUT_TYPE_MAP: Record<string, string> = {
  strength: "Strength Training",
  cardio: "Running",
  flexibility: "Meditation",
  sports: "Workout",
};

export function ActivitySection({ workouts }: ActivitySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded, animatedHeight, rotateAnim]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Helper function for workout type labels
  const getWorkoutTypeLabel = (workout: WorkoutSession) => {
    const typeLabels: Record<string, string> = {
      strength: "Strength Training",
      cardio: workout.cardioType
        ? workout.cardioType.charAt(0).toUpperCase() +
          workout.cardioType.slice(1)
        : "Cardio",
      flexibility: workout.flexibilityType
        ? workout.flexibilityType.charAt(0).toUpperCase() +
          workout.flexibilityType.slice(1)
        : "Flexibility",
      sports: workout.sportsType
        ? workout.sportsType.charAt(0).toUpperCase() +
          workout.sportsType.slice(1)
        : "Sports",
    };
    return workout.name || typeLabels[workout.type] || "Workout";
  };

  // Get icon color based on workout type
  const getWorkoutColor = (type: WorkoutSession["type"]) => {
    const colors = {
      strength: "#FF5C2A", // Orange
      cardio: "#4CAF50", // Green
      flexibility: "#9C27B0", // Purple
      sports: "#2196F3", // Blue
    };
    return colors[type] || "#FF5C2A";
  };

  if (workouts.length === 0) {
    return <></>;
  }

  return (
    <GlassCard
      intensity={50}
      tint="dark"
      lightColor={Colors.primary}
      style={tw`p-3 pt-2`}
      outerCardStyle={tw`border-white/15 border`}
      roundedClassName="rounded-md"
      onPress={toggleExpanded}
      lightSize={200}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-white/50 font-tussi text-xs `}>
          ACTIVITY ({workouts.length})
        </Text>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={16} color="#FFFFFF66" />
        </Animated.View>
      </View>

      <Animated.View
        style={[
          tw`overflow-hidden `,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 500],
            }),
            opacity: animatedHeight,
          },
        ]}
      >
        <View style={tw`gap-2 mt-4`}>
          {workouts.map((workout) => (
            <View
              key={workout.id}
              style={tw`  pl-1 flex-row items-start gap-3`}
            >
              <View style={tw`pt-1`}>
                {(() => {
                  const IconComponent = getTaskIcon(
                    WORKOUT_TYPE_MAP[workout.type] || "Workout"
                  );
                  return IconComponent ? (
                    <IconComponent
                      size={16}
                      color={getWorkoutColor(workout.type)}
                    />
                  ) : null;
                })()}
              </View>
              <View style={tw`flex-1 gap-[2px]`}>
                <Text style={tw`text-white font-mont-medium text-sm`}>
                  {getWorkoutTypeLabel(workout)}
                </Text>

                <View style={tw`flex-row items-center gap-2`}>
                  <Text style={tw`text-white/60 font-mont text-xs`}>
                    {moment(workout.date).format("h:mm A")} -
                  </Text>
                  <Text style={tw`text-white/60 font-mont text-xs`}>
                    {workout.duration} min
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </GlassCard>
  );
}
