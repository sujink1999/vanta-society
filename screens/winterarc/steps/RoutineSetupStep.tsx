import { RoutineEditor } from "@/components/RoutineEditor";
import tw from "@/constants/tw";
import React from "react";
import { View } from "react-native";

interface RoutineSetupStepProps {
  onNext: () => void;
}

export function RoutineSetupStep({ onNext }: RoutineSetupStepProps) {
  const handleNext = () => {
    // TODO: Implement routine configuration logic
    // API call to save routine config would go here
    console.log("Routine config saved");
    onNext();
  };

  return (
    <View style={tw`flex-1 `}>
      {/* Routine Editor Component */}
      <RoutineEditor onSubmit={handleNext} />
    </View>
  );
}
