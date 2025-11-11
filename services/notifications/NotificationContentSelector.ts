import {
  notificationMessages,
  EngagementState,
  TimeSlot,
} from "@/constants/notificationMessages";

interface NotificationContent {
  title: string;
  body: string;
}

class NotificationContentSelector {
  private static instance: NotificationContentSelector;

  private constructor() {}

  static getInstance(): NotificationContentSelector {
    if (!NotificationContentSelector.instance) {
      NotificationContentSelector.instance = new NotificationContentSelector();
    }
    return NotificationContentSelector.instance;
  }

  /**
   * Select a random message for given time slot and engagement state
   */
  selectMessage(
    timeSlot: TimeSlot,
    engagementState: EngagementState
  ): NotificationContent {
    const messages = notificationMessages[timeSlot][engagementState];

    if (!messages || messages.length === 0) {
      // Fallback message if something goes wrong
      return {
        title: "Time to Check In",
        body: "Your Project66 journey continues.",
      };
    }

    // Select random message from the array
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  /**
   * Get the current time slot based on hour of day
   */
  getCurrentTimeSlot(): TimeSlot {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 11) {
      return "morning"; // 5 AM - 11 AM
    } else if (currentHour >= 11 && currentHour < 16) {
      return "midday"; // 11 AM - 4 PM
    } else if (currentHour >= 16 && currentHour < 21) {
      return "evening"; // 4 PM - 9 PM
    } else {
      return "night"; // 9 PM - 5 AM
    }
  }

  /**
   * Get the next scheduled time slot hour
   */
  getNextScheduledHour(currentHour: number): number {
    const scheduledHours = [7, 12, 18, 21]; // 7 AM, 12 PM, 6 PM, 9 PM

    for (const hour of scheduledHours) {
      if (currentHour < hour) {
        return hour;
      }
    }

    // If we're past all scheduled hours today, return first one for tomorrow
    return scheduledHours[0];
  }

  /**
   * Map scheduled hour to time slot
   */
  getTimeSlotForHour(hour: number): TimeSlot {
    if (hour === 7) return "morning";
    if (hour === 12) return "midday";
    if (hour === 18) return "evening";
    if (hour === 21) return "night";

    // Fallback to current time slot
    return this.getCurrentTimeSlot();
  }
}

export const notificationContentSelector =
  NotificationContentSelector.getInstance();
