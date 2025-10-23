import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Step components
import { DetailsStep } from "./steps/DetailsStep";
import { FinalScoreStep } from "./steps/FinalScoreStep";
import { InviteCodeStep } from "./steps/InviteCodeStep";
import { RecordVitalsStep } from "./steps/RecordVitalsStep";
import { WhatYouUnlockStep } from "./steps/WhatYouUnlockStep";

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

export default function Onboarding() {
  const { user, hasCompletedQuestionnaire } = useGlobalContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<OnboardingStepData>({});

  // Update current step based on user progress
  useEffect(() => {
    if (!user) return;

    // Start from invite code step
    let stepIndex = 0;

    // If user has invite code, skip to details
    if (user.referrerInviteCode) {
      stepIndex = 1;
    }

    // If user has details, skip to what you unlock
    if (user.firstName && user.lastName && user.gender) {
      stepIndex = 2;
    }

    // If user has completed questionnaire, skip to final score
    if (hasCompletedQuestionnaire) {
      stepIndex = 4;
    }

    setCurrentStep(stepIndex);
  }, [user, hasCompletedQuestionnaire]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const getComponent = () => {
    if (currentStep === 0) {
      return <InviteCodeStep onNext={nextStep} />;
    }
    if (currentStep === 1) {
      return <DetailsStep onNext={nextStep} />;
    }
    if (currentStep === 2) {
      return <WhatYouUnlockStep onNext={nextStep} />;
    }
    if (currentStep === 3) {
      return <RecordVitalsStep onNext={nextStep} />;
    }
    if (currentStep === 4) {
      return <FinalScoreStep />;
    }

    // Default fallback
    return <InviteCodeStep onNext={nextStep} />;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>{getComponent()}</SafeAreaView>
  );
}
