import { Button } from "@/components/Button";
import { SafeAreaBackground } from "@/components/SafeAreaBackground";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { ExerciseInput } from "@/components/workout/ExerciseInput";
import { ExerciseSelectionModal } from "@/components/workout/ExerciseSelectionModal";
import tw from "@/constants/tw";
import { Exercise, WorkoutSession } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import moment from "moment";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { PlatformBlurView } from "../PlatformBlurView";

interface LogStrengthViewProps {
  exerciseHistory: string[];
  isLogging: boolean;
  selectedDate: string;
  onBack: () => void;
  onSubmit: (session: WorkoutSession) => Promise<void>;
}

export function LogStrengthView({
  exerciseHistory,
  isLogging,
  selectedDate,
  onBack,
  onSubmit,
}: LogStrengthViewProps) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const handleAddExercise = (exerciseName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        name: exerciseName,
        sets: [{ reps: 0, weight: 0, unit: "lbs" }], // Default first set
      },
    ]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(
      exercises.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleSubmit = async () => {
    const validExercises = exercises.filter(
      (e) => e.name.trim() && e.sets.length > 0
    );

    // Allow logging workouts without exercises
    // Just require a duration

    if (!duration || parseInt(duration) <= 0) {
      Alert.alert("Invalid Duration", "Enter workout duration in minutes");
      return;
    }

    const session: WorkoutSession = {
      id: uuidv4(),
      date: moment(selectedDate).toISOString(),
      type: "strength",
      name: workoutName.trim(),
      duration: parseInt(duration),
      exercises: validExercises,
      notes: notes.trim() || undefined,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };

    console.log("submitted session", session);

    await onSubmit(session);
  };

  return (
    <SafeAreaBackground
      imageSource={require("@/assets/images/backgrounds/tools-bg.png")}
    >
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={tw`flex-1`}>
          {/* Header */}
          <View style={tw`px-3 pt-2 pb-2`}>
            <TouchableOpacity
              onPress={onBack}
              style={tw`p-2 bg-white/5 self-start border border-white/5 rounded-md mb-4`}
            >
              <ChevronLeftIcon size={20} color="white" />
            </TouchableOpacity>

            {/* Editable Workout Name */}
            <TextInput
              style={[tw`text-white font-tussi text-lg h-8 `]}
              placeholder="workout name"
              placeholderTextColor="#979797"
              value={workoutName}
              onChangeText={setWorkoutName}
              autoFocus
            />
          </View>

          <ScrollView
            style={tw`flex-1 px-2 pt-6`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Duration Input */}
            <PlatformBlurView
              intensity={20}
              tint="light"
              style={tw`rounded-lg overflow-hidden border border-white/20 mb-3 p-4`}
            >
              <Text style={tw`text-white/80 font-mont text-xs mb-2`}>
                Duration (minutes)
              </Text>
              <TextInput
                style={tw`bg-black/40 h-10 border border-white/10 rounded-md px-3 text-white font-mont text-sm`}
                placeholder="30"
                placeholderTextColor="#979797"
                keyboardType="number-pad"
                value={duration}
                onChangeText={setDuration}
              />
              <Text style={tw`text-white/80 font-mont text-xs mb-2 mt-4`}>
                Notes (optional)
              </Text>
              <TextInput
                style={tw`bg-black/40 min-h-20 border border-white/10 rounded-md px-3 py-2 text-white font-mont text-sm`}
                placeholder="Add any notes about your workout..."
                placeholderTextColor="#979797"
                multiline
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </PlatformBlurView>
            {exercises.length > 0 && (
              <Text style={tw`text-white/80 font-tussi text-sm mb-2 p-1 py-2`}>
                Exercises
              </Text>
            )}
            {/* Exercise List */}
            {exercises.map((exercise) => (
              <ExerciseInput
                key={exercise.id}
                exercise={exercise}
                onUpdate={(updates) => updateExercise(exercise.id, updates)}
                onRemove={() => removeExercise(exercise.id)}
              />
            ))}

            {/* Add Exercise Button */}
            <TouchableOpacity
              onPress={() => setShowExerciseModal(true)}
              style={tw`mb-4`}
            >
              <PlatformBlurView
                intensity={20}
                tint="light"
                style={tw`rounded-md overflow-hidden border border-white/20 overflow-hidden`}
              >
                <View
                  style={tw`p-4 flex-row items-center justify-center gap-2`}
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={tw`text-white font-mont-medium text-sm`}>
                    Add Exercise
                  </Text>
                </View>
              </PlatformBlurView>
            </TouchableOpacity>
          </ScrollView>

          <View style={tw`px-2 pb-6`}>
            <Button
              title="Log Workout"
              onPress={handleSubmit}
              loading={isLogging}
              disabled={!workoutName.trim()}
              style={tw`text-black bg-white`}
              textStyle={tw`text-black`}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <ExerciseSelectionModal
        visible={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        onSelect={handleAddExercise}
        exerciseHistory={exerciseHistory}
        currentExerciseNames={exercises.map((e) => e.name)}
      />
    </SafeAreaBackground>
  );
}
