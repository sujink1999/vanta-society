import { LoadingScreen } from "@/components/LoadingScreen";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { GoogleAuthService } from "@/services/auth/GoogleAuthService";
import { router, useSegments } from "expo-router";
import React, { useEffect } from "react";

interface AuthNavigatorProps {
  children: React.ReactNode;
}

export default function AuthNavigator({ children }: AuthNavigatorProps) {
  const { user, isAuthenticating } = useGlobalContext();
  const segments = useSegments();

  useEffect(() => {
    // Configure Google Sign-In when component mounts
    GoogleAuthService.configure();
  }, []);

  useEffect(() => {
    if (isAuthenticating) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inWinterArcGroup = segments[0] === "(winterarc)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!user && !inAuthGroup) {
      // User not authenticated and not in auth group, redirect to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // User authenticated but in auth group, check flow order
      if (needsOnboarding(user)) {
        router.replace("/(onboarding)");
      } else if (needsWinterArcSetup(user)) {
        router.replace("/(winterarc)");
      } else {
        router.replace("/(tabs)/winterarc");
      }
    } else if (user && inTabsGroup && needsOnboarding(user)) {
      // User in main app but needs onboarding
      router.replace("/(onboarding)");
    } else if (user && inTabsGroup && needsWinterArcSetup(user)) {
      // User in main app but needs winter arc setup
      router.replace("/(winterarc)");
    } else if (user && inOnboardingGroup && !needsOnboarding(user)) {
      // User completed onboarding, check if needs winter arc setup
      if (needsWinterArcSetup(user)) {
        router.replace("/(winterarc)");
      } else {
        router.replace("/(tabs)/winterarc");
      }
    } else if (user && inWinterArcGroup && !needsWinterArcSetup(user)) {
      // User in winter arc but doesn't need it anymore
      router.replace("/(tabs)/winterarc");
    }
  }, [user, isAuthenticating, segments]);

  // Helper function to determine if user needs onboarding
  const needsOnboarding = (user: any) => {
    // Check if onboarding is marked as complete
    return !user.onboardingDone;
  };

  // Helper function to determine if user needs winter arc setup
  const needsWinterArcSetup = (user: any) => {
    // If no start date set, needs setup
    return Boolean(!user.winterArcStartDate);
  };

  if (isAuthenticating) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
