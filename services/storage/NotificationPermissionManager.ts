import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import moment from "moment";

const STORAGE_KEY = "notification_last_asked_at";
const DAYS_BEFORE_RETRY = 3;

class NotificationPermissionManager {
  private static instance: NotificationPermissionManager;

  private constructor() {}

  static getInstance(): NotificationPermissionManager {
    if (!NotificationPermissionManager.instance) {
      NotificationPermissionManager.instance =
        new NotificationPermissionManager();
    }
    return NotificationPermissionManager.instance;
  }

  /**
   * Get timestamp of when we last asked for permissions
   */
  private async getLastAskedAt(): Promise<moment.Moment | null> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEY);
      if (!timestamp) {
        return null;
      }
      return moment(timestamp);
    } catch (error) {
      console.error("Failed to get last asked timestamp:", error);
      return null;
    }
  }

  /**
   * Save timestamp of when we asked for permissions
   */
  private async setLastAskedAt(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, timestamp);
    } catch (error) {
      console.error("Failed to save last asked timestamp:", error);
    }
  }

  /**
   * Check if we should ask for permissions
   * Returns true if:
   * - OS permissions already granted (user enabled in settings)
   * - Never asked before
   * - It's been 3+ days since last ask
   */
  async shouldAskForPermission(): Promise<boolean> {
    // Check actual OS permission status (source of truth)
    const { status: osStatus } = await Notifications.getPermissionsAsync();

    // If OS says granted, we're good to proceed
    if (osStatus === "granted") {
      return true;
    }

    // Get when we last asked
    const lastAskedAt = await this.getLastAskedAt();

    // Never asked before - ask now
    if (!lastAskedAt) {
      return true;
    }

    // Check if enough time has passed since last ask
    const daysSinceLastAsk = moment().diff(lastAskedAt, "days");
    return daysSinceLastAsk >= DAYS_BEFORE_RETRY;
  }

  /**
   * Record that we asked for permissions (regardless of result)
   */
  async recordAsked(): Promise<void> {
    await this.setLastAskedAt(moment().toISOString());
  }

  /**
   * Reset state (for testing or if user wants to be asked again)
   */
  async reset(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export const notificationPermissionManager =
  NotificationPermissionManager.getInstance();
