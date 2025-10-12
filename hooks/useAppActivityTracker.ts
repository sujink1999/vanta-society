import { appActivityStorageManager } from "@/services/storage/AppActivityStorageManager";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useAppActivityTracker() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Log initial state if app is already active
    if (AppState.currentState === "active") {
      appActivityStorageManager.logAppForeground();
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // App moved to foreground (inactive/background → active)
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        appActivityStorageManager.logAppForeground();
      }

      // App moved to background (active → inactive/background)
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        appActivityStorageManager.logAppBackground();
      }

      appState.current = nextAppState;
    });

    // Cleanup: log background when component unmounts
    return () => {
      subscription.remove();
      if (appState.current === "active") {
        appActivityStorageManager.logAppBackground();
      }
    };
  }, []);
}
