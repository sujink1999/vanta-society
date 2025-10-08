import { EveningCheckIn } from "@/components/EveningCheckIn";
import { FullScreenModal } from "@/components/FullScreenModal";
import { MorningCheckIn } from "@/components/MorningCheckIn";
import { useCheckInFlow } from "@/hooks/useCheckInFlow";
import React from "react";

export function CheckInManager() {
  const {
    shouldShowMorning,
    shouldShowEvening,
    isChecking,
    completeMorningCheckIn,
    completeEveningCheckIn,
  } = useCheckInFlow();

  // Don't render anything while checking
  if (isChecking) {
    return <></>;
  }

  // Priority: Morning check-in first, then evening
  if (shouldShowMorning) {
    return (
      <FullScreenModal visible={true}>
        <MorningCheckIn onComplete={completeMorningCheckIn} />
      </FullScreenModal>
    );
  }

  if (shouldShowEvening) {
    return (
      <FullScreenModal visible={true}>
        <EveningCheckIn onComplete={completeEveningCheckIn} />
      </FullScreenModal>
    );
  }

  return <></>;
}
