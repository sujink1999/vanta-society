import { Button } from "@/components/Button";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import { SafeAreaBackground } from "@/components/SafeAreaBackground";
import tw from "@/constants/tw";
import {
  CardioType,
  DistanceUnit,
  FlexibilityType,
  SportsType,
  WorkoutSession,
  WorkoutType,
} from "@/services/api/types";
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

const CARDIO_TYPES: { label: string; value: CardioType }[] = [
  { label: "Running", value: "running" },
  { label: "Cycling", value: "cycling" },
  { label: "Swimming", value: "swimming" },
  { label: "Rowing", value: "rowing" },
  { label: "Other", value: "other" },
];

const FLEXIBILITY_TYPES: { label: string; value: FlexibilityType }[] = [
  { label: "Yoga", value: "yoga" },
  { label: "Stretching", value: "stretching" },
  { label: "Mobility", value: "mobility" },
];

const SPORTS_TYPES: { label: string; value: SportsType }[] = [
  { label: "Basketball", value: "basketball" },
  { label: "Soccer", value: "soccer" },
  { label: "Tennis", value: "tennis" },
  { label: "Swimming", value: "swimming" },
  { label: "Other", value: "other" },
];

interface LogSimpleViewProps {
  workoutType: WorkoutType;
  isLogging: boolean;
  selectedDate: string;
  onBack: () => void;
  onSubmit: (session: WorkoutSession) => Promise<void>;
}

export function LogSimpleView({
  workoutType,
  isLogging,
  selectedDate,
  onBack,
  onSubmit,
}: LogSimpleViewProps) {
  const getInitialSubType = (): CardioType | FlexibilityType | SportsType => {
    if (workoutType === "cardio") return "running";
    if (workoutType === "flexibility") return "yoga";
    return "basketball";
  };

  const [workoutName, setWorkoutName] = useState("");
  const [subType, setSubType] = useState<
    CardioType | FlexibilityType | SportsType
  >(getInitialSubType());
  const [customSportsName, setCustomSportsName] = useState("");
  const [duration, setDuration] = useState("30");
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("miles");
  const [pace, setPace] = useState("");
  const [notes, setNotes] = useState("");

  const getSubTypeOptions = () => {
    if (workoutType === "cardio") return CARDIO_TYPES;
    if (workoutType === "flexibility") return FLEXIBILITY_TYPES;
    if (workoutType === "sports") return SPORTS_TYPES;
    return [];
  };

  const handleSubmit = async () => {
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert("Invalid Duration", "Enter workout duration in minutes");
      return;
    }

    if (
      workoutType === "sports" &&
      subType === "other" &&
      !customSportsName.trim()
    ) {
      Alert.alert("Invalid Sport", "Enter the sport name");
      return;
    }

    const session: WorkoutSession = {
      id: uuidv4(),
      date: moment(selectedDate).toISOString(),
      type: workoutType,
      name: workoutName.trim(),
      duration: parseInt(duration),
      notes: notes.trim() || undefined,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    };

    if (workoutType === "cardio") {
      session.cardioType = subType as CardioType;
      if (distance && parseFloat(distance) > 0) {
        session.distance = parseFloat(distance);
        session.distanceUnit = distanceUnit;
      }
      if (pace.trim()) {
        session.pace = pace.trim();
      }
    } else if (workoutType === "flexibility") {
      session.flexibilityType = subType as FlexibilityType;
    } else if (workoutType === "sports") {
      session.sportsType = subType as SportsType;
      if (subType === "other") {
        session.customSportsName = customSportsName.trim();
      }
    }

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
              style={[tw`text-white font-tussi text-lg h-8`]}
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
            {/* Type Selection */}
            <PlatformBlurView
              intensity={20}
              tint="light"
              style={tw`rounded-lg overflow-hidden border border-white/20 mb-3 p-4`}
            >
              <Text style={tw`text-white/80 font-mont text-xs mb-3`}>Type</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {getSubTypeOptions().map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setSubType(option.value)}
                    style={[
                      tw`px-3 py-2 rounded-md`,
                      subType === option.value
                        ? tw`bg-white/20`
                        : tw`bg-black/40`,
                    ]}
                  >
                    <Text
                      style={tw`font-mont text-sm ${
                        subType === option.value
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </PlatformBlurView>

            {workoutType === "sports" && subType === "other" && (
              <PlatformBlurView
                intensity={20}
                tint="light"
                style={tw`rounded-lg overflow-hidden border border-white/20 mb-3 p-4`}
              >
                <Text style={tw`text-white/80 font-mont text-xs mb-2`}>
                  Sport Name
                </Text>
                <TextInput
                  style={tw`bg-black/40 h-10 border border-white/10 rounded-md px-3 text-white font-mont text-sm`}
                  placeholder="e.g., Volleyball"
                  placeholderTextColor="#979797"
                  value={customSportsName}
                  onChangeText={setCustomSportsName}
                />
              </PlatformBlurView>
            )}

            {/* Duration and Notes */}
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

              {workoutType === "cardio" && (
                <>
                  <Text style={tw`text-white/80 font-mont text-xs mb-2 mt-4`}>
                    Distance (optional)
                  </Text>
                  <View style={tw`flex-row gap-2`}>
                    <TextInput
                      style={tw`flex-1 bg-black/40 h-10 border border-white/10 rounded-md px-3 text-white font-mont text-sm`}
                      placeholder="5.0"
                      placeholderTextColor="#979797"
                      keyboardType="decimal-pad"
                      value={distance}
                      onChangeText={setDistance}
                    />
                    <View
                      style={tw`flex-row bg-black/40 border border-white/10 rounded-md overflow-hidden`}
                    >
                      <TouchableOpacity
                        onPress={() => setDistanceUnit("miles")}
                        style={[
                          tw`px-3 py-2`,
                          distanceUnit === "miles" && tw`bg-white/20`,
                        ]}
                      >
                        <Text
                          style={tw`font-mont text-sm ${
                            distanceUnit === "miles"
                              ? "text-white"
                              : "text-white/60"
                          }`}
                        >
                          mi
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setDistanceUnit("km")}
                        style={[
                          tw`px-3 py-2`,
                          distanceUnit === "km" && tw`bg-white/20`,
                        ]}
                      >
                        <Text
                          style={tw`font-mont text-sm ${
                            distanceUnit === "km"
                              ? "text-white"
                              : "text-white/60"
                          }`}
                        >
                          km
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={tw`text-white/80 font-mont text-xs mb-2 mt-4`}>
                    Pace (optional)
                  </Text>
                  <TextInput
                    style={tw`bg-black/40 h-10 border border-white/10 rounded-md px-3 text-white font-mont text-sm`}
                    placeholder="e.g., 8:30/mi"
                    placeholderTextColor="#979797"
                    value={pace}
                    onChangeText={setPace}
                  />
                </>
              )}

              <Text style={tw`text-white/80 font-mont text-xs mb-2 mt-4`}>
                Notes (optional)
              </Text>
              <TextInput
                style={tw`bg-black/40 min-h-20 border border-white/10 rounded-md px-3 py-2 text-white font-mont text-sm`}
                placeholder="How did it feel?"
                placeholderTextColor="#979797"
                multiline
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </PlatformBlurView>
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
    </SafeAreaBackground>
  );
}
