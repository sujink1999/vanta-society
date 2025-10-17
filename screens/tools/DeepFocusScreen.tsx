import { Button } from "@/components/Button";
import { CircularProgressTimer } from "@/components/CircularProgressTimer";
import { DurationSelector } from "@/components/DurationSelector";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { DeepWorkIcon } from "@/components/icons/TaskIcons";
import tw from "@/constants/tw";
import { useDeepFocus } from "@/hooks/useDeepFocus";
import { useKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DURATION_PRESETS = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
  { label: "90 minutes", value: 90 },
  { label: "120 minutes", value: 120 },
];

export default function DeepFocusScreen() {
  const router = useRouter();
  const {
    timeRemaining,
    isActive,
    isPaused,
    progress,
    start,
    pause,
    resume,
    stop,
  } = useDeepFocus();
  const [selectedDuration, setSelectedDuration] = useState(45);

  const isActiveRef = useRef(isActive);
  const stopRef = useRef(stop);

  // Keep refs up to date
  useEffect(() => {
    isActiveRef.current = isActive;
    stopRef.current = stop;
  }, [isActive, stop]);

  // Keep screen awake when timer is active
  useKeepAwake("DeepFocusTimer", {
    suppressDeactivateWarnings: !isActive,
  });

  // Detect screen blur (navigation away) and stop timer
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      return () => {
        // Screen is about to blur (user navigating away)
        // Check if timer is currently active and stop it
        if (isActiveRef.current) {
          stopRef.current("navigation");
        }
      };
    }, [])
  );

  const handleStart = () => {
    start(selectedDuration);
  };

  const handleStop = () => {
    Alert.alert(
      "Stop Focus Session?",
      "Your progress will be saved, but the session won't count as completed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: () => stop("manual"),
        },
      ]
    );
  };

  if (isActive) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 px-3 py-4`}>
          {/* Timer */}
          <View style={tw`items-center justify-center flex-1`}>
            <CircularProgressTimer
              timeRemaining={timeRemaining}
              progress={progress}
              isPaused={isPaused}
            />
          </View>

          {/* Controls */}
          <View style={tw`gap-3 px-3`}>
            {isPaused ? (
              <Button title="Resume" onPress={resume} style={tw`py-4`} />
            ) : (
              <Button
                title="Pause"
                onPress={pause}
                style={tw`py-4 bg-white/10`}
                textStyle={tw`text-white`}
              />
            )}
            <TouchableOpacity
              style={tw`py-4 items-center`}
              onPress={handleStop}
            >
              <Text style={tw`text-white/40 font-mont text-sm`}>
                End Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={tw`p-2 ml-3 mt-3 bg-white/5 self-start border border-white/5 rounded-md`}
      >
        <ChevronLeftIcon size={20} color="white" />
      </TouchableOpacity>

      <View style={tw`flex-1 px-3`}>
        {/* Header */}
        <View style={tw`pb-6 flex-col items-center justify-center gap-2`}>
          <DeepWorkIcon size={40} color="#FFFFFF" />
          <Text
            style={tw`text-white font-tussi-bold text-2xl mt-2 text-center`}
          >
            Deep Focus
          </Text>
          <Text style={tw`text-white/60 font-mont text-sm text-center`}>
            Select your session duration
          </Text>
        </View>

        {/* Duration Selector - Vertical Scroll */}
        <DurationSelector
          options={DURATION_PRESETS}
          selectedDuration={selectedDuration}
          onSelect={setSelectedDuration}
        />
      </View>

      {/* Start Button */}
      <View style={tw`px-3 pb-6`}>
        <Button
          title={`Start Session`}
          onPress={handleStart}
          style={tw`py-4 `}
        />
      </View>
    </SafeAreaView>
  );
}
