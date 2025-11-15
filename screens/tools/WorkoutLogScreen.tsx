import { LogSimpleView } from "@/components/workout/LogSimpleView";
import { LogStrengthView } from "@/components/workout/LogStrengthView";
import { WorkoutHomeView } from "@/components/workout/WorkoutHomeView";
import { WorkoutTypeModal } from "@/components/workout/WorkoutTypeModal";
import tw from "@/constants/tw";
import { useWorkoutActions } from "@/hooks/useWorkoutActions";
import { useWorkouts } from "@/hooks/useWorkouts";
import { WorkoutSession, WorkoutType } from "@/services/api/types";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewState = "home" | "log-strength" | "log-simple";

export default function WorkoutLogScreen() {
  const { workouts, stats, loading, refetch, getUserExerciseHistory } =
    useWorkouts();
  const { logWorkout, isLogging } = useWorkoutActions();

  const [viewState, setViewState] = useState<ViewState>("home");
  const [refreshing, setRefreshing] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType>("strength");
  const [exerciseHistory, setExerciseHistory] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (viewState === "log-strength") {
      loadExerciseHistory();
    }
  }, [viewState]);

  const loadExerciseHistory = async () => {
    const history = await getUserExerciseHistory();
    setExerciseHistory(history);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSelectWorkoutType = (type: WorkoutType) => {
    setSelectedWorkoutType(type);
    setShowTypeModal(false);
    if (type === "strength") {
      setViewState("log-strength");
    } else {
      setViewState("log-simple");
    }
  };

  const handleBackToHome = () => {
    setViewState("home");
  };

  const handleWorkoutSubmit = async (session: WorkoutSession) => {
    const success = await logWorkout(session);

    if (success) {
      Alert.alert("Success", "Workout logged!", [
        { text: "OK", onPress: handleBackToHome },
      ]);
      await refetch();
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#FF5C2A" />
        </View>
      </SafeAreaView>
    );
  }

  // Log Strength View
  if (viewState === "log-strength") {
    return (
      <LogStrengthView
        exerciseHistory={exerciseHistory}
        isLogging={isLogging}
        selectedDate={selectedDate}
        onBack={handleBackToHome}
        onSubmit={handleWorkoutSubmit}
      />
    );
  }

  // Log Simple View (Cardio/Flexibility/Sports)
  if (viewState === "log-simple") {
    return (
      <LogSimpleView
        workoutType={selectedWorkoutType}
        isLogging={isLogging}
        selectedDate={selectedDate}
        onBack={handleBackToHome}
        onSubmit={handleWorkoutSubmit}
      />
    );
  }

  // Home View (default)
  return (
    <>
      <WorkoutHomeView
        workouts={workouts}
        stats={stats}
        refreshing={refreshing}
        selectedDate={selectedDate}
        onRefresh={onRefresh}
        onLogWorkout={() => setShowTypeModal(true)}
        onDateSelect={setSelectedDate}
        onWorkoutPress={(workout) => {
          // Workout detail modal is handled internally by WorkoutHomeView
        }}
      />

      <WorkoutTypeModal
        visible={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onSelectType={handleSelectWorkoutType}
      />
    </>
  );
}
