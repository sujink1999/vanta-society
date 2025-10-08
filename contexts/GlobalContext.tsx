import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useUser";
import { useWinterArcStats } from "@/hooks/useWinterArcStats";
import { User, UserRoutine } from "@/services/api/types";
import {
  Notification,
  NotificationType,
  VitalNotification,
  VitalType,
} from "@/types/notification";
import React, { createContext, ReactNode, useContext } from "react";

interface GlobalContextType {
  user: User | null;
  routine: UserRoutine[];
  hasCompletedQuestionnaire: boolean;
  isAuthenticating: boolean;
  refetchUser: (checkBackup?: boolean) => Promise<void>;
  refetchUserSilently: () => Promise<void>;
  winterArcStats: {
    currentScores: {
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
    potentialScores: {
      discipline: number;
      mindset: number;
      strength: number;
      momentum: number;
      confidence: number;
      society: number;
    };
    streak: number;
    streakCadenceLast7Days: number[];
    tasksCompletedCumulative: number[];
    isLoading: boolean;
  };
  notifications: (Notification | VitalNotification)[];
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  addVitalNotification: (
    vitalType: VitalType,
    amount: number,
    currentScore: number,
    previousScore: number,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const userState = useUser();
  const winterArcStats = useWinterArcStats(userState.user, userState.routine);
  const notificationState = useNotifications();

  const contextValue = {
    ...userState,
    winterArcStats,
    ...notificationState,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
