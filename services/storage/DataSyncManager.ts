import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncData, getBackupData } from "../api";
import { scoreStorageManager } from "./ScoreStorageManager";
import { taskStorageManager } from "./TaskStorageManager";

const LAST_SYNC_KEY = "last_sync_timestamp";

class DataSyncManager {
  private static instance: DataSyncManager;
  private isSyncing = false;
  private lastSyncTime: string | null = null;

  private constructor() {}

  static getInstance(): DataSyncManager {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager();
    }
    return DataSyncManager.instance;
  }

  /**
   * Initialize data sync manager
   */
  async initialize(): Promise<void> {
    // Load last sync time from storage
    try {
      this.lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_KEY);
    } catch (error) {
      console.error("Failed to load last sync time:", error);
    }
  }

  /**
   * Sync all local data to backend
   */
  async syncToBackend(): Promise<boolean> {
    if (this.isSyncing) {
      console.log("Sync already in progress, skipping");
      return false;
    }

    this.isSyncing = true;

    try {
      // Get all local data
      const scores = await scoreStorageManager.getScores();
      const completions = await taskStorageManager.getAllCompletions();

      // Don't sync if no scores yet (user hasn't completed onboarding)
      if (!scores) {
        console.log("No scores to sync yet");
        return false;
      }

      // Prepare backup data with current timestamp
      const currentTimestamp = new Date().toISOString();
      const backupData = {
        scores: {
          discipline: scores.discipline,
          mindset: scores.mindset,
          strength: scores.strength,
          momentum: scores.momentum,
          confidence: scores.confidence,
          society: scores.society,
        },
        completions,
        lastSync: currentTimestamp,
      };

      // Call backend sync API
      const response = await syncData({ backupData });

      if (response.success) {
        // Update last sync time to the timestamp we just sent
        this.lastSyncTime = currentTimestamp;
        await AsyncStorage.setItem(LAST_SYNC_KEY, currentTimestamp);

        console.log("Data synced successfully at", currentTimestamp);
        return true;
      } else {
        console.error("Sync failed:", response);
        return false;
      }
    } catch (error) {
      console.error("Failed to sync data to backend:", error);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Force immediate sync
   */
  async forceSyncNow(): Promise<boolean> {
    return await this.syncToBackend();
  }

  /**
   * Get last sync timestamp
   */
  getLastSyncTime(): string | null {
    return this.lastSyncTime;
  }

  /**
   * Restore data from backend backup if cloud data is newer
   * Call this when user logs in
   */
  async restoreFromBackup(): Promise<boolean> {
    try {
      console.log("Fetching backup data from backend...");
      const response = await getBackupData();

      if (!response.success) {
        console.log("No backup data available on backend");
        return false;
      }

      const { backupData, lastSyncDate } = response.data;

      // Check if we should restore based on timestamps
      const localLastSync = this.lastSyncTime;

      if (localLastSync && lastSyncDate) {
        const localTime = new Date(localLastSync).getTime();
        const cloudTime = new Date(lastSyncDate).getTime();

        if (localTime >= cloudTime) {
          console.log("Local data is newer or same as cloud, skipping restore");
          return false;
        }
      }

      console.log("Cloud data is newer, restoring from backup...");

      // Restore scores to local storage
      if (backupData.scores) {
        await scoreStorageManager.updateScores({
          discipline: backupData.scores.discipline,
          mindset: backupData.scores.mindset,
          strength: backupData.scores.strength,
          momentum: backupData.scores.momentum,
          confidence: backupData.scores.confidence,
          society: backupData.scores.society,
        });
        console.log("Scores restored from backup");
      }

      // Restore task completions to local storage
      if (backupData.completions) {
        // TaskStorageManager expects TaskCompletionData format
        // We need to restore the entire cache
        const taskManager = taskStorageManager as any;
        await taskManager.initialize();
        taskManager.cache = backupData.completions;
        await (taskManager as any).saveToStorage();
        console.log("Task completions restored from backup");
      }

      // Update last sync time
      this.lastSyncTime = lastSyncDate;
      await AsyncStorage.setItem(LAST_SYNC_KEY, lastSyncDate);

      console.log("Data restored successfully from backup at", lastSyncDate);
      return true;
    } catch (error) {
      console.error("Failed to restore data from backup:", error);
      return false;
    }
  }
}

export const dataSyncManager = DataSyncManager.getInstance();
