import {
  countdownMessages,
  defaultCountdownMessage,
} from "@/constants/countdownMessages";
import { notificationPermissionManager } from "@/services/storage/NotificationPermissionManager";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { Platform } from "react-native";
import { notificationContentSelector } from "./NotificationContentSelector";
import { userEngagementAnalyzer } from "./UserEngagementAnalyzer";
// Configure how notifications are displayed when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationScheduler {
  private static instance: NotificationScheduler;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  /**
   * Initialize notification system and request permissions
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      // Check if we should ask for permissions
      const shouldAsk =
        await notificationPermissionManager.shouldAskForPermission();

      if (!shouldAsk) {
        console.log("Not asking for notification permissions yet (too soon)");
        return false;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted");
        return false;
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize notification scheduler:", error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF5C2A",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only prompt if not already granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;

      // Record that we asked (regardless of result)
      await notificationPermissionManager.recordAsked();
    }

    return finalStatus === "granted";
  }

  /**
   * Schedule countdown notifications for Project66 start (once per day at 9 AM)
   */
  async scheduleCountdownNotifications(startDate: string): Promise<void> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.log("Cannot schedule notifications without permissions");
        return;
      }
    }

    try {
      // Cancel all existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const start = moment(startDate);
      const today = moment().startOf("day");
      const daysUntilStart = start.diff(today, "days");

      // Get appropriate countdown message
      const message =
        countdownMessages[daysUntilStart] || defaultCountdownMessage;

      // Schedule notification at 9 AM daily
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === "ios" && {
            interruptionLevel: "timeSensitive" as any,
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 9,
          minute: 0,
        },
      });

      console.log(
        `Countdown notification scheduled - ${daysUntilStart} days until Project66`
      );
    } catch (error) {
      console.error("Failed to schedule countdown notifications:", error);
    }
  }

  /**
   * Schedule all daily notifications (7 AM, 12 PM, 6 PM, 9 PM)
   */
  async scheduleDailyNotifications(): Promise<void> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.log("Cannot schedule notifications without permissions");
        return;
      }
    }

    try {
      // Cancel all existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule notifications for each time slot
      const scheduledHours = [
        { hour: 6, slot: "morning" as const },
        { hour: 12, slot: "midday" as const },
        { hour: 19, slot: "evening" as const },
        { hour: 21, slot: "night" as const },
      ];

      for (const { hour, slot } of scheduledHours) {
        await this.scheduleNotificationForTimeSlot(hour, slot);
      }

      console.log("Daily notifications scheduled successfully");
    } catch (error) {
      console.error("Failed to schedule daily notifications:", error);
    }
  }

  /**
   * Schedule a notification for a specific time slot
   */
  private async scheduleNotificationForTimeSlot(
    hour: number,
    timeSlot: "morning" | "midday" | "evening" | "night"
  ): Promise<void> {
    try {
      // Get user engagement state
      const engagementState =
        await userEngagementAnalyzer.getUserEngagementState();

      // Select appropriate message
      const message = notificationContentSelector.selectMessage(
        timeSlot,
        engagementState
      );

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === "ios" && {
            interruptionLevel: "timeSensitive" as any,
          }),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute: 0,
        },
      });

      console.log(
        `Scheduled ${timeSlot} notification for ${hour}:00 - State: ${engagementState}`
      );
    } catch (error) {
      console.error(`Failed to schedule notification for ${timeSlot}:`, error);
    }
  }

  /**
   * Send an immediate test notification
   */
  async sendTestNotification(): Promise<void> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.log("Cannot send notification without permissions");
        return;
      }
    }

    try {
      const engagementState =
        await userEngagementAnalyzer.getUserEngagementState();
      const timeSlot = notificationContentSelector.getCurrentTimeSlot();
      const message = notificationContentSelector.selectMessage(
        timeSlot,
        engagementState
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === "ios" && {
            interruptionLevel: "timeSensitive" as any,
          }),
        },
        trigger: null, // Send immediately
      });

      console.log("Test notification sent");
    } catch (error) {
      console.error("Failed to send test notification:", error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("All notifications cancelled");
    } catch (error) {
      console.error("Failed to cancel notifications:", error);
    }
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export const notificationScheduler = NotificationScheduler.getInstance();
