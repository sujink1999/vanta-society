import {
  checkInStorageManager,
  EveningCheckIn,
} from "@/services/storage/CheckInStorageManager";
import moment from "moment";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useCheckInFlow() {
  const [shouldShowMorning, setShouldShowMorning] = useState(false);
  const [shouldShowEvening, setShouldShowEvening] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkCheckInStatus = async () => {
    setIsChecking(true);

    const now = moment();
    const currentHour = now.hour();
    const today = now.format("YYYY-MM-DD");

    // Morning window: 5:00 AM - 11:59 AM
    const isMorningWindow = currentHour >= 5 && currentHour < 12;

    // Evening window: 8:00 PM - 11:59 PM
    const isEveningWindow = currentHour >= 18 && currentHour < 24;

    // Check completion status
    const morningCompleted = await checkInStorageManager.hasMorningCheckIn(
      today
    );
    const eveningCompleted = await checkInStorageManager.hasEveningCheckIn(
      today
    );

    // Determine what to show
    setShouldShowMorning(isMorningWindow && !morningCompleted);
    setShouldShowEvening(isEveningWindow && !eveningCompleted);

    setIsChecking(false);
  };

  useEffect(() => {
    // Initial check
    checkCheckInStatus();

    // Listen for app state changes (foreground/background)
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // App came to foreground, check again
          checkCheckInStatus();
        }
      }
    );

    // Subscribe to storage changes
    const unsubscribe = checkInStorageManager.subscribe(() => {
      checkCheckInStatus();
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  const completeMorningCheckIn = async () => {
    const today = moment().format("YYYY-MM-DD");
    await checkInStorageManager.completeMorningCheckIn(today);
    setShouldShowMorning(false);
  };

  const completeEveningCheckIn = async (data: {
    totalTasks: number;
    completedTasks: number;
    completedTaskIds: number[];
    dayMood?: string;
    journal?: string;
    imageRefs?: string[];
  }) => {
    const today = moment().format("YYYY-MM-DD");
    await checkInStorageManager.completeEveningCheckIn(today, data);
    setShouldShowEvening(false);
  };

  const getDailySummary = async (
    date: string
  ): Promise<EveningCheckIn | null> => {
    return await checkInStorageManager.getDailySummary(date);
  };

  return {
    shouldShowMorning,
    shouldShowEvening,
    isChecking,
    completeMorningCheckIn,
    completeEveningCheckIn,
    getDailySummary,
  };
}
