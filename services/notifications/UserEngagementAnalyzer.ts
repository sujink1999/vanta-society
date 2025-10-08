import { checkInStorageManager } from "@/services/storage/CheckInStorageManager";
import { taskStorageManager } from "@/services/storage/TaskStorageManager";
import { EngagementState } from "@/constants/notificationMessages";
import moment from "moment";

class UserEngagementAnalyzer {
  private static instance: UserEngagementAnalyzer;

  private constructor() {}

  static getInstance(): UserEngagementAnalyzer {
    if (!UserEngagementAnalyzer.instance) {
      UserEngagementAnalyzer.instance = new UserEngagementAnalyzer();
    }
    return UserEngagementAnalyzer.instance;
  }

  /**
   * Get the most recent activity timestamp from check-ins and task completions
   */
  async getLastActivityDate(): Promise<moment.Moment | null> {
    const checkInData = await checkInStorageManager.getCache();
    const taskData = await taskStorageManager.getAllCompletions();

    const timestamps: string[] = [];

    // Collect check-in timestamps
    Object.values(checkInData).forEach((dailyCheckIn) => {
      if (dailyCheckIn.morning?.timestamp) {
        timestamps.push(dailyCheckIn.morning.timestamp);
      }
      if (dailyCheckIn.evening?.timestamp) {
        timestamps.push(dailyCheckIn.evening.timestamp);
      }
    });

    // Collect task completion timestamps
    Object.values(taskData).forEach((dayTasks) => {
      Object.values(dayTasks).forEach((completion) => {
        timestamps.push(completion.timestamp);
      });
    });

    if (timestamps.length === 0) {
      return null;
    }

    // Find the most recent timestamp
    const sortedTimestamps = timestamps.sort((a, b) =>
      moment(b).diff(moment(a))
    );
    return moment(sortedTimestamps[0]);
  }

  /**
   * Calculate days since last activity
   */
  async getDaysSinceLastActivity(): Promise<number> {
    const lastActivity = await this.getLastActivityDate();
    if (!lastActivity) {
      return Infinity; // No activity ever
    }

    const now = moment();
    const daysDiff = now.diff(lastActivity, "days");
    return daysDiff;
  }

  /**
   * Get tasks completed today
   */
  async getTasksCompletedToday(): Promise<{ done: number; skipped: number }> {
    const today = moment().format("YYYY-MM-DD");
    return await taskStorageManager.getDailyStats(today);
  }

  /**
   * Check if user has checked in today (morning or evening)
   */
  async hasCheckedInToday(): Promise<{
    morning: boolean;
    evening: boolean;
    any: boolean;
  }> {
    const today = moment().format("YYYY-MM-DD");
    const checkInStatus = await checkInStorageManager.getCheckInStatus(today);

    const morning = checkInStatus.morning?.completed || false;
    const evening = checkInStatus.evening?.completed || false;

    return {
      morning,
      evening,
      any: morning || evening,
    };
  }

  /**
   * Calculate current streak (consecutive days with at least one completed task)
   */
  async getCurrentStreak(): Promise<number> {
    const taskData = await taskStorageManager.getAllCompletions();

    let streak = 0;
    let currentDate = moment();

    // Check backwards day by day until we find a day without completions
    while (true) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      const dayStats = await taskStorageManager.getDailyStats(dateStr);

      // If no tasks completed on this day, break the streak
      if (dayStats.done === 0) {
        break;
      }

      streak++;
      currentDate = currentDate.subtract(1, "day");

      // Safety limit to prevent infinite loops (1 year)
      if (streak > 365) {
        break;
      }
    }

    return streak;
  }

  /**
   * Determine if user has done any activity today (check-in or task completion)
   */
  async hasActivityToday(): Promise<boolean> {
    const checkIn = await this.hasCheckedInToday();
    const tasks = await this.getTasksCompletedToday();

    return checkIn.any || tasks.done > 0;
  }

  /**
   * Get user engagement state for notification selection
   */
  async getUserEngagementState(): Promise<EngagementState> {
    const daysSinceLastActivity = await this.getDaysSinceLastActivity();
    const hasActivityToday = await this.hasActivityToday();
    const currentStreak = await this.getCurrentStreak();

    // On a streak (3+ consecutive days)
    if (currentStreak >= 3) {
      return "on_streak";
    }

    // Active today
    if (hasActivityToday) {
      return "engaged";
    }

    // Inactive today, but active recently
    if (daysSinceLastActivity === 0) {
      return "inactive_today";
    }

    // Missing 1 day
    if (daysSinceLastActivity === 1) {
      return "missing_1_day";
    }

    // Missing 2+ days
    return "missing_2+_days";
  }
}

export const userEngagementAnalyzer = UserEngagementAnalyzer.getInstance();
