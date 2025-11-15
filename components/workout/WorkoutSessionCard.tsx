import tw from "@/constants/tw";
import { WorkoutSession } from "@/services/api/types";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import GlassCard from "../GlassCard";
import { getTaskIcon } from "../icons/TaskIcons";

interface WorkoutSessionCardProps {
  session: WorkoutSession;
  onPress: () => void;
}

const WORKOUT_TASK_NAMES: Record<string, string> = {
  strength: "Strength Training",
  cardio: "Running",
  flexibility: "Meditation",
  sports: "Workout",
};

const WORKOUT_COLORS = {
  strength: "#FF5C2A",
  cardio: "#4CAF50",
  flexibility: "#9C27B0",
  sports: "#2196F3",
};

export function WorkoutSessionCard({
  session,
  onPress,
}: WorkoutSessionCardProps) {
  const type = session.type;
  const taskName = WORKOUT_TASK_NAMES[type];
  const IconComponent = getTaskIcon(taskName);
  const iconColor = WORKOUT_COLORS[type];

  const getSubtitle = () => {
    if (type === "strength" && session.exercises) {
      const exerciseCount = session.exercises.length;
      const totalSets = session.exercises.reduce(
        (sum, ex) => sum + ex.sets.length,
        0
      );
      const exerciseText = exerciseCount === 1 ? "exercise" : "exercises";
      const setText = totalSets === 1 ? "set" : "sets";
      return `${exerciseCount} ${exerciseText} • ${totalSets} ${setText}`;
    }

    if (session.type === "cardio" && session.distance) {
      return `${session.distance} ${session.distanceUnit}`;
    }

    return `${session.duration} min`;
  };

  return (
    <GlassCard
      lightColor={iconColor}
      intensity={50}
      onPress={onPress}
      outerCardStyle={tw`mb-3`}
    >
      <View style={tw`flex-row items-center p-4 gap-3`}>
        {/* Icon */}
        <View
          style={[
            tw`w-10 h-10 rounded-xl items-center justify-center`,
            { backgroundColor: `${iconColor}20` },
          ]}
        >
          {IconComponent && <IconComponent size={24} color={iconColor} />}
        </View>

        {/* Content */}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center justify-between mb-1`}>
            <Text style={tw`text-white font-tussi text-sm capitalize`}>
              {session.name || session.type}
            </Text>
            <Text style={tw`text-white/60 font-mont text-xs`}>
              {moment(session.date).format("MMM D")}
            </Text>
          </View>

          <Text style={tw`text-white/80 font-mont text-sm`}>
            {getSubtitle()}
          </Text>

          {session.notes && (
            <Text
              style={tw`text-white/60 font-mont text-xs mt-1`}
              numberOfLines={1}
            >
              {session.notes}
            </Text>
          )}
        </View>
      </View>
    </GlassCard>
  );
}
