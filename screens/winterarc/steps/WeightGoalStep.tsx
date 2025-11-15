import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { RoutineGenerationLoader } from "@/components/RoutineGenerationLoader";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { generateRoutine } from "@/services/api/routines";
import { submitPhysicalStats } from "@/services/api/users";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface GoalsStepProps {
  onNext: () => void;
}

export function WeightGoalStep({ onNext }: GoalsStepProps) {
  const { refetchUserSilently } = useGlobalContext();
  const [epicGoal, setEpicGoal] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = async () => {
    setLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 7000; // 7 seconds

    try {
      const current = parseFloat(currentWeight);
      const target = parseFloat(targetWeight);

      const physicalStats = {
        epicGoal: epicGoal.trim(),
        weightGoal: { current: current, target: target },
      };

      // Step 1: Submit physical stats
      const physicalStatsResponse = await submitPhysicalStats({
        physicalStats,
      });

      if (!physicalStatsResponse.success) {
        console.error(
          "Failed to submit physical stats:",
          physicalStatsResponse.error
        );
        return;
      }

      // Step 2: Generate routine using AI
      const routineResponse = await generateRoutine();

      if (routineResponse.success) {
        // Step 3: Ensure minimum loading time has passed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = minLoadingTime - elapsedTime;

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        // Step 4: Refetch user data to update routine in context
        await refetchUserSilently();
      } else {
        console.error("Failed to generate routine:", routineResponse.error);
        // Could add error handling UI here
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      // Could add error handling UI here
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    epicGoal.trim().length > 0 &&
    currentWeight.trim().length > 0 &&
    targetWeight.trim().length > 0 &&
    parseFloat(currentWeight) > 0 &&
    parseFloat(targetWeight) > 0;

  // Show loading animation when generating routine
  if (loading) {
    return <RoutineGenerationLoader visible={loading} />;
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 px-6 pt-8 pb-6`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          <View style={tw` flex flex-col items-center gap-8`}>
            <GradientText
              style={tw`text-2xl font-tussi-bold text-white text-center `}
            >
              SET YOUR GOALS
            </GradientText>

            {/* Epic Goal Section */}
            <View style={tw`flex-col  w-full`}>
              <Text style={tw`text-white font-mont-medium text-lg mb-2  `}>
                Do you have a goal you are chasing?
              </Text>
              <Text style={tw`text-white/70 font-mont text-sm  mb-4 `}>
                This is your epic goal. It could be career, fitness, personal
                development, or any major goal you want to achieve.
              </Text>
              <TextInput
                style={tw`  border border-white/20 rounded-sm px-4 py-3 text-white font-mont text-base min-h-[80px]`}
                value={epicGoal}
                onChangeText={setEpicGoal}
                placeholder="e.g. Run a marathon, Start my own business..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* <View style={tw`h-[1px] bg-white/20 w-full`} /> */}

            {/* Weight Goal Section */}
            <View style={tw` w-full flex flex-col mt-10`}>
              <Text style={tw`text-white font-mont-medium text-lg mb-6`}>
                What&apos;s your weight goal?
              </Text>

              <View style={tw`flex-row gap-2 `}>
                <View
                  style={tw`  rounded-md pr-2 py-[16px] flex-col items-center`}
                >
                  <View
                    style={tw`w-4 h-4 rounded-full border-2 border-primary`}
                  />
                  <View style={tw`w-1 h-4 bg-white/20 flex-1`} />
                  <View style={tw`w-4 h-4 bg-primary rounded-full`} />
                </View>
                <View style={tw`flex-col gap-2 flex-1`}>
                  <View
                    style={tw`flex-1 flex-row justify-between items-center`}
                  >
                    <Text style={tw`text-white/70 font-mont-medium text-sm `}>
                      Current Weight (kg)
                    </Text>
                    <TextInput
                      style={tw` flex-1 max-w-30 border border-white/20 rounded-sm px-4 py-2 text-white font-mont text-lg text-center`}
                      value={currentWeight}
                      onChangeText={setCurrentWeight}
                      placeholder="75"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                    />
                  </View>

                  <View
                    style={tw`flex-1 flex-row justify-between items-center `}
                  >
                    <Text style={tw`text-white/70 font-mont-medium text-sm `}>
                      Target Weight (kg)
                    </Text>
                    <TextInput
                      style={tw` flex-1 max-w-30 border border-white/20 rounded-sm px-4 py-2 text-white font-mont text-lg text-center`}
                      value={targetWeight}
                      onChangeText={setTargetWeight}
                      placeholder="75"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <View>
        <Button
          title="GET MY ROUTINE"
          onPress={handleNext}
          disabled={!isValid}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
