import { apiClient } from "@/services/api/client";
import { User, UserRoutine } from "@/services/api/types";
import { getProfile } from "@/services/api/users";
import { useCallback, useEffect, useState } from "react";

interface UseUserReturn {
  user: User | null;
  routine: UserRoutine[];
  hasCompletedQuestionnaire: boolean;
  isAuthenticating: boolean;
  refetchUser: () => Promise<void>;
  refetchUserSilently: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [routine, setRoutine] = useState<UserRoutine[]>([]);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const isAuthenticated = await apiClient.isAuthenticated();

      if (!isAuthenticated) {
        setUser(null);
        setHasCompletedQuestionnaire(false);
        setIsAuthenticating(false);
        return;
      }

      // Fetch user profile
      const response = await getProfile();

      if (response.success) {
        setUser(response.data.user);
        setRoutine(response.data.routine);
        setHasCompletedQuestionnaire(response.data.hasCompletedQuestionnaire);
      } else {
        // Token might be invalid, clear it
        await apiClient.clearToken();
        setUser(null);
        setRoutine([]);
        setHasCompletedQuestionnaire(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Clear potentially invalid token
      await apiClient.clearToken();
      setUser(null);
      setRoutine([]);
      setHasCompletedQuestionnaire(false);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    setIsAuthenticating(true);
    await fetchUser();
  }, [fetchUser]);

  const refetchUserSilently = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    routine,
    hasCompletedQuestionnaire,
    isAuthenticating,
    refetchUser,
    refetchUserSilently,
  };
}
