import { workoutStorageManager } from "@/services/storage/WorkoutStorageManager";
import {
  StravaAPIService,
  StravaAthlete,
  stravaAuth,
  WorkoutData,
} from "@/services/strava";
import { convertStravaToWorkoutSession } from "@/services/strava/StravaWorkoutConverter";
import { useEffect, useState } from "react";

export function useStrava() {
  const [isConnected, setIsConnected] = useState(false);
  const [athlete, setAthlete] = useState<StravaAthlete | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    setLoading(true);
    try {
      // First check if we have valid tokens
      const connected = await stravaAuth.isConnected();

      if (!connected) {
        // Not connected or tokens are invalid
        setIsConnected(false);
        setAthlete(null);
        setWorkouts([]);
        setLoading(false);
        return;
      }

      // Verify connection by fetching athlete data
      // This will trigger token refresh if needed and fail if refresh fails
      const athleteData = await stravaAuth.getAthlete();

      if (!athleteData) {
        // Token refresh failed, connection is no longer valid
        setIsConnected(false);
        setAthlete(null);
        setWorkouts([]);
        setLoading(false);
        return;
      }

      // Successfully connected
      setIsConnected(true);
      setAthlete(athleteData);

      // Fetch and import workouts
      await syncWorkouts();
    } catch (error) {
      console.error("Error checking Strava connection:", error);
      // Any error means connection is not valid
      setIsConnected(false);
      setAthlete(null);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const syncWorkouts = async () => {
    try {
      // Initialize workout storage
      await workoutStorageManager.initialize();

      // Get access token (this will attempt refresh if expired)
      const accessToken = await stravaAuth.getValidAccessToken();
      if (!accessToken) {
        // Token refresh failed or no token available
        console.log("No valid access token available - connection may have been lost");
        // Update state to reflect disconnection
        setIsConnected(false);
        setAthlete(null);
        setWorkouts([]);
        return;
      }

      // Fetch workouts from Strava (last 30 days)
      console.log("Fetching Strava workouts...");
      const stravaWorkouts = await StravaAPIService.getRecentWorkouts(
        accessToken,
        30
      );

      setWorkouts(stravaWorkouts);

      // Get existing workouts to check for duplicates
      const existingWorkouts = await workoutStorageManager.getAllWorkouts();
      const existingIds = new Set(existingWorkouts.map((w) => w.id));

      // Convert and import new workouts
      let importedCount = 0;
      for (const stravaWorkout of stravaWorkouts) {
        // Skip if already imported
        if (existingIds.has(stravaWorkout.id)) {
          continue;
        }

        // Convert to WorkoutSession format
        const workoutSession = convertStravaToWorkoutSession(stravaWorkout);

        // Save to workout log
        await workoutStorageManager.saveWorkout(workoutSession);
        importedCount++;
      }

      if (importedCount > 0) {
        console.log(`Imported ${importedCount} new Strava workouts`);
      }
    } catch (error) {
      console.error("Error syncing Strava workouts:", error);
      // If sync fails due to auth issues, update state
      const stillConnected = await stravaAuth.isConnected();
      if (!stillConnected) {
        setIsConnected(false);
        setAthlete(null);
        setWorkouts([]);
      }
    }
  };

  const connect = async () => {
    // Connection is handled via OAuth in StravaConnect component
    // After OAuth completes, call refresh to update state
    await checkConnection();
  };

  const disconnect = async () => {
    try {
      await stravaAuth.disconnect();
      setIsConnected(false);
      setAthlete(null);
    } catch (error) {
      console.error("Error disconnecting Strava:", error);
      throw error;
    }
  };

  const refresh = async () => {
    await checkConnection();
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    athlete,
    workouts,
    loading,
    connect,
    disconnect,
    refresh,
    syncWorkouts,
  };
}
