import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackupData, syncData } from "../api";
import { checkInStorageManager } from "./CheckInStorageManager";
import { scoreStorageManager } from "./ScoreStorageManager";
import { taskStorageManager } from "./TaskStorageManager";

const LAST_SYNC_KEY = "last_sync_timestamp";
const LAST_DATA_UPDATE_KEY = "last_data_update";
const LOGGED_IN_EMAIL_KEY = "logged_in_email";

class DataSyncManager {
  private static instance: DataSyncManager;
  private isSyncing = false;
  private lastSyncTime: string | null = null;
  private lastDataUpdate: string | null = null;
  private loggedInEmail: string | null = null;

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
    // Load last sync time, last data update, and logged in email from storage
    try {
      this.lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_KEY);
      this.lastDataUpdate = await AsyncStorage.getItem(LAST_DATA_UPDATE_KEY);
      this.loggedInEmail = await AsyncStorage.getItem(LOGGED_IN_EMAIL_KEY);
    } catch (error) {
      console.error("Failed to load sync data:", error);
    }
  }

  /**
   * Set the logged in user's email
   * Call this after successful login
   */
  async setLoggedInEmail(email: string): Promise<void> {
    try {
      this.loggedInEmail = email;
      await AsyncStorage.setItem(LOGGED_IN_EMAIL_KEY, email);
      console.log("Logged in email stored:", email);
    } catch (error) {
      console.error("Failed to store logged in email:", error);
    }
  }

  /**
   * Get the currently stored logged in email
   */
  getLoggedInEmail(): string | null {
    return this.loggedInEmail;
  }

  /**
   * Validate storage against current user email
   * Clears all local data if email mismatch is detected
   * Call this after user logs in, before restoring backup
   *
   * @param currentUserEmail - The email of the currently logged-in user
   * @returns true if storage was cleared due to mismatch, false otherwise
   */
  async validateStorage(currentUserEmail: string): Promise<boolean> {
    try {
      const storedEmail = this.getLoggedInEmail();

      if (storedEmail && storedEmail !== currentUserEmail) {
        console.log(
          `Email mismatch detected! Stored: ${storedEmail}, Current: ${currentUserEmail}`
        );
        console.log("Clearing all local data for new account...");

        // Reuse clearAllLocalData to avoid duplication
        await this.clearAllLocalData();

        return true;
      }

      console.log("Storage validation passed - same user");
      return false;
    } catch (error) {
      console.error("Failed to validate storage:", error);
      return false;
    }
  }

  /**
   * Check if two ISO date strings are on the same calendar day
   */
  private isSameCalendarDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  /**
   * Clear all local data (scores, tasks, check-ins, sync info)
   * Only used for account deletion - normal logout preserves data
   */
  async clearAllLocalData(): Promise<void> {
    try {
      console.log("Clearing all local data...");

      // Clear all storage managers
      await scoreStorageManager.clearData();
      await taskStorageManager.clearData();
      await checkInStorageManager.clearData();

      // Clear sync metadata
      await AsyncStorage.removeItem(LAST_SYNC_KEY);
      await AsyncStorage.removeItem(LAST_DATA_UPDATE_KEY);
      await AsyncStorage.removeItem(LOGGED_IN_EMAIL_KEY);

      this.lastSyncTime = null;
      this.lastDataUpdate = null;
      this.loggedInEmail = null;

      console.log("All local data cleared successfully");
    } catch (error) {
      console.error("Failed to clear local data:", error);
    }
  }

  /**
   * Sync all local data to backend
   */
  async syncToBackend(force: boolean = false): Promise<boolean> {
    if (this.isSyncing) {
      console.log("Sync already in progress, skipping");
      return false;
    }

    // Update last data update timestamp immediately when sync is called
    const currentTimestamp = new Date().toISOString();
    this.lastDataUpdate = currentTimestamp;
    await AsyncStorage.setItem(LAST_DATA_UPDATE_KEY, currentTimestamp);

    // Check if already synced today (skip unless forced)
    if (!force) {
      // Check if we already synced today based on lastSyncTime
      if (this.lastSyncTime) {
        const now = new Date().toISOString();
        if (this.isSameCalendarDay(this.lastSyncTime, now)) {
          console.log("Data already synced today, skipping");
          return false;
        }
      }
    }

    this.isSyncing = true;

    try {
      // Get all local data
      const scores = await scoreStorageManager.getScores();
      const completions = await taskStorageManager.getAllCompletions();
      const checkIns = await checkInStorageManager.getCache();

      // Don't sync if no scores yet (user hasn't completed onboarding)
      if (!scores) {
        console.log("No scores to sync yet");
        return false;
      }

      // Prepare backup data with current timestamp
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
        checkIns,
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
   * Force immediate sync (bypasses daily check)
   */
  async forceSyncNow(): Promise<boolean> {
    return await this.syncToBackend(true);
  }

  /**
   * Get last sync timestamp
   */
  getLastSyncTime(): string | null {
    return this.lastSyncTime;
  }

  /**
   * Get last data update timestamp
   */
  getLastDataUpdate(): string | null {
    return this.lastDataUpdate;
  }

  /**
   * Restore data from backend backup if cloud data is newer
   * IMPORTANT: Call validateStorage() before this function
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
      const localLastDataUpdate = this.lastDataUpdate;

      // Check both lastSyncTime and lastDataUpdate against cloud
      if (lastSyncDate) {
        const cloudTime = new Date(lastSyncDate).getTime();

        // Check lastDataUpdate
        if (localLastDataUpdate) {
          const localUpdateTime = new Date(localLastDataUpdate).getTime();

          if (localUpdateTime >= cloudTime) {
            return false;
          }
        }
      }

      console.log("Cloud data is newer, restoring from backup...");

      // Restore scores to local storage
      if (backupData?.scores) {
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
      if (backupData?.completions) {
        await taskStorageManager.restoreCache(backupData.completions);
        console.log("Task completions restored from backup");
      }

      // Restore check-in data to local storage
      if (backupData?.checkIns) {
        await checkInStorageManager.restoreCache(backupData.checkIns);
        console.log("Check-in data restored from backup");
      }

      // Update last sync time and last data update
      this.lastSyncTime = lastSyncDate;
      await AsyncStorage.setItem(LAST_SYNC_KEY, lastSyncDate);

      this.lastDataUpdate = lastSyncDate;
      await AsyncStorage.setItem(LAST_DATA_UPDATE_KEY, lastSyncDate);

      console.log("Data restored successfully from backup at", lastSyncDate);
      return true;
    } catch (error) {
      console.error("Failed to restore data from backup:", error);
      return false;
    }
  }
}

export const dataSyncManager = DataSyncManager.getInstance();
