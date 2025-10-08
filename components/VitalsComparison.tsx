import tw from "@/constants/tw";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { VitalsRadarChart } from "./VitalsRadarChart";

interface VitalsComparisonProps {
  currentScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  potentialScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  oldScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
}

type ScoreType = "current" | "potential" | "day1";

export function VitalsComparison({
  currentScores,
  potentialScores,
  oldScores,
}: VitalsComparisonProps) {
  const [activeTab, setActiveTab] = useState<ScoreType>("current");

  const getScores = () => {
    switch (activeTab) {
      case "current":
        return currentScores;
      case "potential":
        return potentialScores;
      case "day1":
        return oldScores;
      default:
        return currentScores;
    }
  };

  return (
    <View style={tw`flex-col gap-4`}>
      {/* Radar chart */}
      <VitalsRadarChart scores={getScores()} size={300} />
      {/* Tab buttons */}
      <View style={tw`flex-row gap-2 justify-center`}>
        <TouchableOpacity
          onPress={() => setActiveTab("current")}
          style={tw`py-2 px-6 rounded-md ${
            activeTab === "current" ? "bg-white" : "bg-white/10"
          }`}
        >
          <Text
            style={tw`font-tussi text-[10px] ${
              activeTab === "current" ? "text-black" : "text-textSecondary"
            }`}
          >
            Current
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("potential")}
          style={tw`py-2 px-4 rounded-md ${
            activeTab === "potential" ? "bg-white" : "bg-white/10"
          }`}
        >
          <Text
            style={tw`font-tussi text-[10px] ${
              activeTab === "potential" ? "text-black" : "text-textSecondary"
            }`}
          >
            Day 66
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("day1")}
          style={tw`py-2 px-6 rounded-md ${
            activeTab === "day1" ? "bg-white" : "bg-white/10"
          }`}
        >
          <Text
            style={tw`font-tussi text-[10px] ${
              activeTab === "day1" ? "text-black" : "text-textSecondary"
            }`}
          >
            Day 1
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
