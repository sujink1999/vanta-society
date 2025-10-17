import { Button } from "@/components/Button";
import { DurationSelector } from "@/components/DurationSelector";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { MeditationIcon } from "@/components/icons/TaskIcons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const DURATION_PRESETS = [
  { label: "5 minutes", value: 5 },
  { label: "10 minutes", value: 10 },
  { label: "15 minutes", value: 15 },
];

const AUDIO_FILES: Record<number, any> = {
  5: require("@/assets/audio/meditation/5min.mp3"),
  10: require("@/assets/audio/meditation/10min.mp3"),
  15: require("@/assets/audio/meditation/15min.mp3"),
};

export default function MeditationScreen() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0); // Current position in milliseconds
  const [duration, setDuration] = useState(0); // Total duration in milliseconds
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Configure audio session
  useEffect(() => {
    const configureAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    };
    configureAudio();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleFinish = useCallback(async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    setIsPaused(true);
    setHasCompleted(true);
  }, [sound]);

  const handleReplay = async () => {
    if (sound && isLoaded) {
      try {
        await sound.setPositionAsync(0);
        await sound.playAsync();
        setPosition(0);
        setIsPlaying(true);
        setIsPaused(false);
        setHasCompleted(false);
      } catch (error) {
        console.error("Replay error:", error);
      }
    }
  };

  // Update playback status periodically
  useEffect(() => {
    if (!sound || !isLoaded || isSeeking || hasCompleted) return;

    const interval = setInterval(async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);

        // Check if finished - either didJustFinish or position is at/near the end
        const isAtEnd =
          status.durationMillis &&
          status.positionMillis >= status.durationMillis - 100;

        if (status.didJustFinish || isAtEnd) {
          handleFinish();
        }
      }
    }, 100); // Update every 100ms for smooth progress

    return () => clearInterval(interval);
  }, [sound, isLoaded, isSeeking, hasCompleted, handleFinish]);

  const handleStart = async () => {
    try {
      // Unload existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Load new sound
      const audioFile = AUDIO_FILES[selectedDuration];
      const { sound: newSound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: true,
      });

      setSound(newSound);
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoaded(true);
      setHasCompleted(false);
    } catch (error) {
      console.error("Failed to load audio:", error);
      Alert.alert("Error", "Failed to load meditation audio");
    }
  };

  const handlePause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPaused(true);
    }
  };

  const handleResume = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPaused(false);
    }
  };

  const handleStop = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    setSound(null);
    setIsPlaying(false);
    setIsPaused(false);
    setPosition(0);
    setDuration(0);
    setIsLoaded(false);
    setHasCompleted(false);
  };

  const handleSliderValueChange = (value: number) => {
    // Update UI immediately while dragging
    setPosition(value);
  };

  const handleSliderComplete = async (value: number) => {
    // Actually seek when user finishes sliding
    setIsSeeking(false);
    if (sound && isLoaded) {
      try {
        await sound.setPositionAsync(value);

        // Check if user seeked to the end (within 1 second of duration)
        if (duration > 0 && value >= duration - 1000) {
          handleFinish();
        } else if (hasCompleted && value < duration - 1000) {
          // If we were completed and seek backward, reset completed state
          setHasCompleted(false);
        }
      } catch (error) {
        console.error("Seek error:", error);
      }
    }
  };

  const handleSliderStart = () => {
    setIsSeeking(true);
  };

  const handleSkipForward = async () => {
    if (sound && isLoaded && !isSeeking) {
      const newPosition = Math.min(position + 10000, duration); // Skip 10 seconds
      try {
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);

        // Check if we're at the end after skipping
        if (duration > 0 && newPosition >= duration - 1000) {
          handleFinish();
        }
      } catch (error) {
        console.error("Skip forward error:", error);
      }
    }
  };

  const handleSkipBackward = async () => {
    if (sound && isLoaded && !isSeeking) {
      const newPosition = Math.max(position - 10000, 0); // Go back 10 seconds
      try {
        await sound.setPositionAsync(newPosition);
        setPosition(newPosition);

        // If we were completed and skip backward, reset completed state
        if (hasCompleted) {
          setHasCompleted(false);
        }
      } catch (error) {
        console.error("Skip backward error:", error);
      }
    }
  };

  const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isPlaying) {
    const progress = duration > 0 ? position / duration : 0;
    const size = 280;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <SafeAreaView style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 px-6 py-4`}>
          {/* Circular Progress */}
          <View style={tw`items-center justify-center flex-1`}>
            <View style={tw`items-center justify-center`}>
              <Svg
                width={size}
                height={size}
                style={{ transform: [{ rotate: "-90deg" }] }}
              >
                {/* Background circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#1a1a1a"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="#fff"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={tw`absolute items-center`}>
                <Text style={tw`text-white font-tussi text-5xl`}>
                  {formatTime(position)}
                </Text>
                <Text
                  style={tw`text-white/40 font-mont text-xs mt-3 uppercase tracking-wider`}
                >
                  {hasCompleted ? "Completed" : isPaused ? "Paused" : "Playing"}
                </Text>
              </View>
            </View>
          </View>

          {/* Seek Controls */}
          <View style={tw`px-3 mb-6`}>
            {/* Time labels */}
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`text-white/60 font-mont text-xs`}>
                {formatTime(position)}
              </Text>
              <Text style={tw`text-white/60 font-mont text-xs`}>
                {formatTime(duration)}
              </Text>
            </View>

            {/* Slider */}
            <Slider
              style={tw`w-full h-10`}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onValueChange={handleSliderValueChange}
              onSlidingStart={handleSliderStart}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor="#FF5C2A"
              maximumTrackTintColor="#1a1a1a"
              thumbTintColor="#FF5C2A"
            />

            {/* Playback Controls */}
            <View style={tw`flex-row items-center justify-center gap-8 mt-4`}>
              {/* Skip Backward */}
              <TouchableOpacity onPress={handleSkipBackward}>
                <Ionicons name="play-back" size={32} color="white" />
              </TouchableOpacity>

              {/* Play/Pause/Replay */}
              <TouchableOpacity
                onPress={
                  hasCompleted
                    ? handleReplay
                    : isPaused
                    ? handleResume
                    : handlePause
                }
                style={tw`bg-white/10 rounded-full p-4`}
              >
                <Ionicons
                  name={hasCompleted ? "reload" : isPaused ? "play" : "pause"}
                  size={36}
                  color="white"
                />
              </TouchableOpacity>

              {/* Skip Forward */}
              <TouchableOpacity onPress={handleSkipForward}>
                <Ionicons name="play-forward" size={32} color="white" />
              </TouchableOpacity>
            </View>

            {/* End Session Button */}
            <TouchableOpacity
              style={tw`py-4 items-center mt-6`}
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
          <MeditationIcon size={40} color={Colors.textSecondary} />
          <Text
            style={tw`text-white font-tussi-bold text-2xl mt-2 text-center`}
          >
            Meditation
          </Text>
          <Text style={tw`text-white/60 font-mont text-sm text-center`}>
            Select your session duration
          </Text>
        </View>

        {/* Duration Selector */}
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
