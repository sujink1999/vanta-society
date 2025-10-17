import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";

interface DeepFocusStatsProps {
  totalSessions: number;
  totalTime: number;
  averageTime: number;
}

export function DeepFocusStats({
  totalSessions,
  totalTime,
  averageTime,
}: DeepFocusStatsProps) {
  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  if (totalSessions === 0) {
    return null;
  }

  return (
    <View style={tw`mb-4 flex-row gap-2`}>
      <View style={tw`flex-1 bg-white/5 border border-white/10 rounded-md p-3`}>
        <Text style={tw`text-white/60 font-mont text-[10px] mb-1`}>
          SESSIONS
        </Text>
        <Text style={tw`text-white font-tussi text-xl`}>{totalSessions}</Text>
      </View>
      <View style={tw`flex-1 bg-white/5 border border-white/10 rounded-md p-3`}>
        <Text style={tw`text-white/60 font-mont text-[10px] mb-1`}>
          TOTAL TIME
        </Text>
        <Text style={tw`text-white font-tussi text-xl`}>
          {formatDuration(totalTime)}
        </Text>
      </View>
      <View style={tw`flex-1 bg-white/5 border border-white/10 rounded-md p-3`}>
        <Text style={tw`text-white/60 font-mont text-[10px] mb-1`}>AVG</Text>
        <Text style={tw`text-white font-tussi text-xl`}>
          {formatDuration(averageTime)}
        </Text>
      </View>
    </View>
  );
}
