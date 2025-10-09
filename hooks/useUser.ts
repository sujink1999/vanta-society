import { apiClient } from "@/services/api/client";
import { User, UserRoutine } from "@/services/api/types";
import { getProfile } from "@/services/api/users";
import { dataSyncManager } from "@/services/storage/DataSyncManager";
import { scoreStorageManager } from "@/services/storage/ScoreStorageManager";
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

  const fetchUser = useCallback(async (checkBackup = false) => {
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
        const {
          user: userData,
          routine,
          hasCompletedQuestionnaire,
        } = response.data;
        setUser(userData);

        setRoutine(routine);
        setHasCompletedQuestionnaire(hasCompletedQuestionnaire);

        if (checkBackup) {
          await dataSyncManager.initialize();

          // Try to restore from backup if it exists
          if (userData.lastSyncDate) {
            await dataSyncManager.restoreFromBackup();
          } else if (hasCompletedQuestionnaire) {
            // No backup exists, initialize scores from user data if not already present
            const localScores = await scoreStorageManager.getScores();
            if (!localScores) {
              await scoreStorageManager.initializeScores({
                discipline: userData.disciplineScore || 0,
                mindset: userData.mindsetScore || 0,
                strength: userData.strengthScore || 0,
                momentum: userData.momentumScore || 0,
                confidence: userData.confidenceScore || 0,
                society: userData.societyScore || 0,
              });
            }
          }
        }
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

  const refetchUser = useCallback(
    async (checkBackup = false) => {
      setIsAuthenticating(true);
      await fetchUser(checkBackup);
    },
    [fetchUser]
  );

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
