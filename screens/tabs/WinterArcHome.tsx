import { CheckInManager } from "@/components/CheckInManager";
import { Countdown } from "@/components/Countdown";
import { DailyRoutine } from "@/components/DailyRoutine";
import { LoadingScreen } from "@/components/LoadingScreen";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import moment from "moment";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WinterArcHome() {
  const { user } = useGlobalContext();

  // Check if user has Winter Arc start date set
  const hasWinterArcStartDate = user?.winterArcStartDate;

  // Check if Winter Arc has started (start date is in the past)

  // Check if Winter Arc is in countdown phase (start date is in the future)
  const isInCountdown =
    hasWinterArcStartDate && moment(user.winterArcStartDate).isAfter(moment());

  // Case 1: Start date not set
  if (!hasWinterArcStartDate) {
    return <LoadingScreen />;
  }

  // Case 2: Winter Arc hasn't started yet (countdown phase)
  if (isInCountdown) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black pb-[60px]`} edges={["top"]}>
        <Countdown />
      </SafeAreaView>
    );
  }

  // Case 3: Winter Arc has started (show daily routine)
  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
      <DailyRoutine />
      <CheckInManager />
    </SafeAreaView>
  );
}
