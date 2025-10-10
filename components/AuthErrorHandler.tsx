import { useGlobalContext } from "@/contexts/GlobalContext";
import { apiClient } from "@/services/api/client";
import { useEffect } from "react";
import { Alert } from "react-native";

/**
 * Sets up global auth error handler that has access to GlobalContext.
 * Must be rendered inside GlobalProvider.
 */
export function AuthErrorHandler() {
  const { logout } = useGlobalContext();

  useEffect(() => {
    apiClient.setAuthErrorHandler(() => {
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
  }, [logout]);

  return <></>; // This component doesn't render anything
}
