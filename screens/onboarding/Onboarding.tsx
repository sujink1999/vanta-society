import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Step components
import { DetailsStep } from "./steps/DetailsStep";
import { FinalScoreStep } from "./steps/FinalScoreStep";
import { InviteCodeStep } from "./steps/InviteCodeStep";
import { RecordVitalsStep } from "./steps/RecordVitalsStep";
import { WhatYouUnlockStep } from "./steps/WhatYouUnlockStep";

const { width: screenWidth } = Dimensions.get("window");

export type OnboardingStepData = {
  inviteCode?: string;
  details?: {
    firstName: string;
    lastName: string;
    phone: string;
    countryCode: string;
  };
  routine?: any;
  scores?: any;
};

const STEPS = [
  { id: "inviteCode", component: InviteCodeStep },
  { id: "details", component: DetailsStep },
  { id: "whatYouUnlock", component: WhatYouUnlockStep },
  { id: "recordVitals", component: RecordVitalsStep },
  { id: "finalScore", component: FinalScoreStep },
];

export default function Onboarding() {
  const { user, hasCompletedQuestionnaire } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<OnboardingStepData>({});
  const [visibleSteps, setVisibleSteps] = useState<typeof STEPS>([]);
  const slideAnim = new Animated.Value(0);

  // Determine which steps to show based on user data
  useEffect(() => {
    if (!user) return;

    const stepsToShow = STEPS.filter((step) => {
      switch (step.id) {
        case "inviteCode":
          return !user.referrerInviteCode;
        case "details":
          return (
            !user.firstName ||
            !user.lastName ||
            !user.instagramHandle ||
            !user.gender
          );
        case "whatYouUnlock":
          return !hasCompletedQuestionnaire; // Always show
        case "recordVitals":
          return !hasCompletedQuestionnaire; // Main trigger - always check this
        case "finalScore":
          return true; // Always show
        default:
          return true;
      }
    });

    setVisibleSteps(stepsToShow);
  }, [user, hasCompletedQuestionnaire]);

  const nextStep = () => {
    if (currentStep < visibleSteps.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(currentStep + 1) * screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep + 1);
    }
  };

  if (visibleSteps.length === 0) {
    return null; // Still determining steps
  }

  const StepComponent = visibleSteps[currentStep]?.component;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <StepComponent data={stepData} onNext={nextStep} />
    </SafeAreaView>
  );
}
