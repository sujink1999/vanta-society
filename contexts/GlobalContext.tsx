import { useInAppPurchase } from "@/hooks/useInAppPurchase";
import { useNotifications } from "@/hooks/useNotifications";
import { useTablet } from "@/hooks/useTablet";
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
import { PurchasesPackage } from "react-native-purchases";

interface GlobalContextType {
  user: User | null;
  routine: UserRoutine[];
  hasCompletedQuestionnaire: boolean;
  isAuthenticating: boolean;
  isTablet: boolean;
  refetchUser: (checkBackup?: boolean) => Promise<void>;
  refetchUserSilently: () => Promise<void>;
  logout: (clearData?: boolean) => Promise<void>;
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
    idealBedtime: string;
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
  // In-app purchase
  winterArcPurchased: boolean;
  packages: PurchasesPackage[];
  selectedPackage: PurchasesPackage | null;
  isPurchaseLoading: boolean;
  isPurchasing: boolean;
  purchase: (pkg?: PurchasesPackage) => Promise<{
    success: boolean;
    error?: any;
  }>;
  restorePurchases: () => Promise<{ success: boolean; error?: any }>;
  checkPurchaseAccess: () => Promise<void>;
  setSelectedPackage: (pkg: PurchasesPackage | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const userState = useUser();
  const winterArcStats = useWinterArcStats(userState.user, userState.routine);
  const notificationState = useNotifications();
  const purchaseState = useInAppPurchase();
  const isTablet = useTablet();

  const contextValue = {
    ...userState,
    isTablet,
    winterArcStats,
    ...notificationState,
    // In-app purchase
    winterArcPurchased: purchaseState.winterArcPurchased,
    packages: purchaseState.packages,
    selectedPackage: purchaseState.selectedPackage,
    isPurchaseLoading: purchaseState.isLoading,
    isPurchasing: purchaseState.isPurchasing,
    purchase: purchaseState.purchase,
    restorePurchases: purchaseState.restorePurchases,
    checkPurchaseAccess: purchaseState.checkAccess,
    setSelectedPackage: purchaseState.setSelectedPackage,
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
