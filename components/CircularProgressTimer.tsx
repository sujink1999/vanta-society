import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressTimerProps {
  timeRemaining: number;
  progress: number;
  isPaused: boolean;
}

export function CircularProgressTimer({
  timeRemaining,
  progress,
  isPaused,
}: CircularProgressTimerProps) {
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
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
          stroke="#FF5C2A"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={tw`absolute items-center`}>
        <Text style={tw`text-white font-tussi text-5xl`}>
          {formatTime(timeRemaining)}
        </Text>
        <Text
          style={tw`text-white/40 font-mont text-xs mt-3 uppercase tracking-wider`}
        >
          {isPaused ? "Paused" : "Focus Mode"}
        </Text>
      </View>
    </View>
  );
}
