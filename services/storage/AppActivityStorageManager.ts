import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const STORAGE_KEY = "app_activity_sessions";

export interface ActivitySession {
  startTime: string; // ISO timestamp
  endTime: string | null; // ISO timestamp, null if session is ongoing
}

export interface ActivityData {
  [date: string]: ActivitySession[];
}

class AppActivityStorageManager {
  private static instance: AppActivityStorageManager;
  private cache: ActivityData = {};
  private isInitialized = false;
  private listeners: Set<() => void> = new Set();
  private currentSession: { startTime: string; date: string } | null = null;

  private constructor() {}

  static getInstance(): AppActivityStorageManager {
    if (!AppActivityStorageManager.instance) {
      AppActivityStorageManager.instance = new AppActivityStorageManager();
    }
    return AppActivityStorageManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      this.cache = data ? JSON.parse(data) : {};
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize AppActivityStorageManager:", error);
      this.cache = {};
      this.isInitialized = true;
    }
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save app activity data:", error);
    }
  }

  async logAppForeground(timestamp?: string): Promise<void> {
    await this.initialize();

    const now = timestamp || moment().toISOString();
    const date = moment(now).format("YYYY-MM-DD");

    // Start a new session
    this.currentSession = { startTime: now, date };
  }

  async logAppBackground(timestamp?: string): Promise<void> {
    await this.initialize();

    if (!this.currentSession) {
      // No active session, nothing to close
      return;
    }

    const now = timestamp || moment().toISOString();
    const { startTime, date } = this.currentSession;

    // Ensure the date exists in cache
    if (!this.cache[date]) {
      this.cache[date] = [];
    }

    // Add completed session
    this.cache[date].push({
      startTime,
      endTime: now,
    });

    // Clear current session
    this.currentSession = null;

    await this.save();
  }

  async getActivityForDate(date: string): Promise<ActivitySession[]> {
    await this.initialize();
    const sessions = this.cache[date];
    return sessions ? [...sessions] : [];
  }

  async getActivityDuringPeriod(
    startTime: string,
    endTime: string
  ): Promise<ActivitySession[]> {
    await this.initialize();

    const start = moment(startTime);
    const end = moment(endTime);
    const sessions: ActivitySession[] = [];

    // Check all dates that might overlap with the period
    for (const date in this.cache) {
      const dateSessions = this.cache[date];

      for (const session of dateSessions) {
        const sessionStart = moment(session.startTime);

        // Check if session overlaps with the period
        if (sessionStart.isAfter(start) && sessionStart.isBefore(end)) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  }

  async getTotalActiveTime(date: string): Promise<number> {
    await this.initialize();

    const sessions = this.cache[date] || [];
    let totalMs = 0;

    for (const session of sessions) {
      if (session.endTime) {
        const start = moment(session.startTime);
        const end = moment(session.endTime);
        totalMs += end.diff(start);
      }
    }

    return totalMs;
  }

  async clearAllActivities(): Promise<void> {
    await this.initialize();
    this.cache = {};
    this.currentSession = null;
    await this.save();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const appActivityStorageManager =
  AppActivityStorageManager.getInstance();
