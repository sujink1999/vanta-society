import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Step components
import { RoutineSetupStep } from "./steps/RoutineSetupStep";
import { WeightGoalStep } from "./steps/WeightGoalStep";
import { WinterArcInfoStep } from "./steps/WinterArcInfoStep";
import { WinterArcStartDateStep } from "./steps/WinterArcStartDateStep";

export default function WinterArc() {
  const { user, routine } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(0);

  // Update current step based on user progress
  useEffect(() => {
    if (!user) return;

    // Start from info step
    let stepIndex = 0;

    // If user has physicalStats, skip weight goal step
    if (user.physicalStats?.epicGoal) {
      stepIndex = 1; // Skip to routine setup
    }

    // If user has routine, skip routine setup
    if (routine.length > 0) {
      stepIndex = 2; // Skip to start date
    }

    // If user has winter arc start date, redirect to tabs
    if (user.winterArcStartDate) {
      // Winter arc setup is complete, this flow shouldn't be shown
      return;
    }

    setCurrentStep(stepIndex);
  }, [user, routine]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const getComponent = () => {
    if (currentStep === 0) {
      return <WinterArcInfoStep onNext={nextStep} />;
    }
    if (currentStep === 1) {
      return <WeightGoalStep onNext={nextStep} />;
    }
    if (currentStep === 2) {
      return <RoutineSetupStep onNext={nextStep} />;
    }
    if (currentStep === 3) {
      return <WinterArcStartDateStep onNext={nextStep} />;
    }

    // Default fallback
    return <WinterArcInfoStep onNext={nextStep} />;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>{getComponent()}</SafeAreaView>
  );
}
