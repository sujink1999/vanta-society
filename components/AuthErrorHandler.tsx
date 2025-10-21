import { useGlobalContext } from "@/contexts/GlobalContext";
import { apiClient } from "@/services/api/client";
import { usePathname } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

/**
 * Sets up global auth error handler that has access to GlobalContext.
 * Must be rendered inside GlobalProvider.
 */
export function AuthErrorHandler() {
  const { logout } = useGlobalContext();
  const pathname = usePathname();

  useEffect(() => {
    apiClient.setAuthErrorHandler(() => {
      // Don't show alert if user is already on login page
      if (pathname === "/login") return;

      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again.",
        [
          {
            text: "OK",
            onPress: () => logout(),
          },
        ]
      );
    });
  }, [logout, pathname]);

  return <></>; // This component doesn't render anything
}
