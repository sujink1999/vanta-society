import { Button } from "@/components/Button";
import { CircularProgressTimer } from "@/components/CircularProgressTimer";
import { DurationSelector } from "@/components/DurationSelector";
import GlassCard from "@/components/GlassCard";
import { SafeAreaBackground } from "@/components/SafeAreaBackground";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { DeepWorkIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useDeepFocus } from "@/hooks/useDeepFocus";
import { useKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  if (isActive) {
    return (
      <SafeAreaBackground
        imageSource={require("@/assets/images/backgrounds/tools-bg.png")}
      >
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
              onPress={() => stop("manual")}
            >
              <Text style={tw`text-white/40 font-mont text-sm`}>
                End Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaBackground>
    );
  }

  return (
    <SafeAreaBackground
      imageSource={require("@/assets/images/backgrounds/tools-bg.png")}
    >
      {/* Back Button */}
      <GlassCard
        onPress={() => router.back()}
        outerCardStyle={tw` ml-3 mt-3 self-start`}
        style={tw`p-2`}
        intensity={30}
        tint="dark"
        lightColor={"white"}
        hapticStyle="light"
        enableHaptics={true}
        enableSound={true}
        lightSize={40}
      >
        <ChevronLeftIcon size={20} color="white" />
      </GlassCard>

      <View style={tw`flex-1 px-3`}>
        {/* Header */}
        <View style={tw`pb-6 flex-col items-center justify-center gap-2`}>
          <DeepWorkIcon size={40} color={Colors.textSecondary} />
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
        <Button title={`Start Session`} onPress={handleStart} />
      </View>
    </SafeAreaBackground>
  );
}
