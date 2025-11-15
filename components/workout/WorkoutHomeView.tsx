import { SafeAreaBackground } from "@/components/SafeAreaBackground";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { WorkoutCalendar } from "@/components/workout/WorkoutCalendar";
import { WorkoutDetailModal } from "@/components/workout/WorkoutDetailModal";
import { WorkoutSessionCard } from "@/components/workout/WorkoutSessionCard";
import tw from "@/constants/tw";
import { WorkoutSession, WorkoutStats } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WorkoutHomeViewProps {
  workouts: WorkoutSession[];
  stats: WorkoutStats;
  refreshing: boolean;
  selectedDate: string;
  onRefresh: () => void;
  onLogWorkout: () => void;
  onWorkoutPress: (workout: WorkoutSession) => void;
  onDateSelect: (date: string) => void;
}

export function WorkoutHomeView({
  workouts,
  stats,
  refreshing,
  selectedDate,
  onRefresh,
  onLogWorkout,
  onWorkoutPress,
  onDateSelect,
}: WorkoutHomeViewProps) {
  const router = useRouter();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSession | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const selectedDayWorkouts = selectedDate
    ? workouts.filter((w) => moment(w.date).isSame(selectedDate, "day"))
    : [];

  const handleDayPress = (date: string) => {
    onDateSelect(date);
  };

  const handleWorkoutPress = (workout: WorkoutSession) => {
    setSelectedWorkout(workout);
    setShowDetailModal(true);
  };

  return (
    <SafeAreaBackground
      imageSource={require("@/assets/images/backgrounds/tools-bg.png")}
    >
      {/* Back Button */}

      <View style={tw`flex-row items-start justify-between  px-3`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 bg-white/5 self-start border border-white/5 rounded-md`}
        >
          <ChevronLeftIcon size={20} color="white" />
        </TouchableOpacity>
        {/* Header */}
        <View style={tw`pb-6 flex-col items-center justify-center gap-2`}>
          <Text style={tw`text-white font-tussi-bold text-lg mt-2 text-center`}>
            Workout Log
          </Text>
        </View>
        <View style={tw`w-6`} />
      </View>

      <View style={tw`flex-1`}>
        <ScrollView
          style={tw`flex-1 px-2 pt-6`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF5C2A"
            />
          }
        >
          {
            <>
              <View style={tw`mb-6`}>
                <WorkoutCalendar
                  workouts={workouts}
                  onDayPress={handleDayPress}
                  selectedDate={selectedDate}
                />
              </View>

              {selectedDate && (
                <View style={tw`mb-6`}>
                  {/* Date Header with Log Workout Button */}
                  <View style={tw`flex-row items-start justify-between mb-6`}>
                    <Text style={tw`text-white font-tussi text-sm`}>
                      {moment(selectedDate).format("dddd, MMM D")}
                    </Text>
                    {moment(selectedDate).isSameOrBefore(moment(), 'day') && (
                      <TouchableOpacity
                        onPress={onLogWorkout}
                        style={tw`flex-row items-center gap-1.5 bg-white px-3 py-2 rounded-md`}
                      >
                        <Ionicons name="add" size={16} color="black" />
                        <Text style={tw`text-black font-tussi text-xs`}>
                          Log workout
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {selectedDayWorkouts.length === 0 ? (
                    <View style={tw`bg-white/5 rounded-lg p-6 items-center`}>
                      <Text
                        style={tw`text-white/60 font-mont text-sm text-center`}
                      >
                        No workouts on this day
                      </Text>
                    </View>
                  ) : (
                    selectedDayWorkouts.map((workout) => (
                      <WorkoutSessionCard
                        key={workout.id}
                        session={workout}
                        onPress={() => handleWorkoutPress(workout)}
                      />
                    ))
                  )}
                </View>
              )}
            </>
          }
        </ScrollView>
      </View>

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        visible={showDetailModal}
        workout={selectedWorkout}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedWorkout(null);
        }}
      />
    </SafeAreaBackground>
  );
}
