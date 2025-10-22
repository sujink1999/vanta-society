import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { VitalsRadarChart } from "@/components/VitalsRadarChart";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { completeOnboarding } from "@/services/api/users";
import { scoreStorageManager } from "@/services/storage/ScoreStorageManager";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

export function FinalScoreStep() {
  const { user, refetchUserSilently } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);

  // Use scores from data (just calculated) or user (existing)
  const scores = {
    discipline: user?.disciplineScore || 0,
    mindset: user?.mindsetScore || 0,
    strength: user?.strengthScore || 0,
    momentum: user?.momentumScore || 0,
    confidence: user?.confidenceScore || 0,
    society: user?.societyScore || 0,
  };

  // Initialize score storage manager with user's scores
  useEffect(() => {
    const initializeScores = async () => {
      try {
        const existingScores = await scoreStorageManager.getScores();

        // If no existing scores, initialize with current user scores
        if (!existingScores) {
          await scoreStorageManager.initializeScores(scores);
          console.log("Score storage initialized with user scores:", scores);
        }
      } catch (error) {
        console.error("Failed to initialize score storage:", error);
      }
    };

    if (user) {
      initializeScores();
    }
  }, [user]);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const response = await completeOnboarding();

      if (response.success) {
        await refetchUserSilently();
      } else {
        Alert.alert(
          "Error",
          "Failed to move to the next step. Please try again."
        );
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert(
        "Error",
        "Failed to move to the next step. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 flex-col justify-between px-3 pt-6 pb-6`}>
      <View style={tw`flex-1`} />
      <View style={tw`gap-4 flex flex-col items-center `}>
        <GradientText
          style={tw`text-textPrimary text-center font-tussi-bold text-4`}
        >
          YOUR VITALS SCORE
        </GradientText>
        <Text style={tw`text-primary font-tussi text-6xl text-center`}>
          {scores.society?.toFixed(0) || 0}{" "}
          <Text style={tw`text-textSecondary  text-base`}>/ 100</Text>
        </Text>
      </View>
      <View style={tw`flex-2`} />

      {/* Radar Chart */}
      <VitalsRadarChart scores={scores} />
      <View style={tw`flex-2`} />

      <Button title="CONTINUE" onPress={handleFinish} loading={isLoading} />
    </View>
  );
}
