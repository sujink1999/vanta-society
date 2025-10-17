import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "deep_focus_sessions";
const ACTIVE_SESSION_KEY = "deep_focus_active_session";

export interface FocusSession {
  id: string;
  startTime: string; // ISO timestamp
  duration: number; // in seconds
  completedDuration: number; // actual time completed in seconds
  isCompleted: boolean;
  endTime?: string; // ISO timestamp
}

export interface ActiveSession {
  id: string;
  startTime: string;
  duration: number;
  remainingTime: number; // in seconds
  isPaused: boolean;
  lastPauseTime?: string;
}

export interface FocusSessionHistory {
  [date: string]: FocusSession[];
}

class DeepFocusStorageManager {
  private static instance: DeepFocusStorageManager;
  private cache: FocusSessionHistory = {};
  private isInitialized = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): DeepFocusStorageManager {
    if (!DeepFocusStorageManager.instance) {
      DeepFocusStorageManager.instance = new DeepFocusStorageManager();
    }
    return DeepFocusStorageManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      this.cache = data ? JSON.parse(data) : {};
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize DeepFocusStorageManager:", error);
      this.cache = {};
      this.isInitialized = true;
    }
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save focus sessions:", error);
    }
  }

  /**
   * Save active session state (for persistence across app restarts)
   */
  async saveActiveSession(session: ActiveSession): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save active session:", error);
    }
  }

  /**
   * Get active session if exists
   */
  async getActiveSession(): Promise<ActiveSession | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to get active session:", error);
      return null;
    }
  }

  /**
   * Clear active session
   */
  async clearActiveSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (error) {
      console.error("Failed to clear active session:", error);
    }
  }

  /**
   * Log completed session
   */
  async logSession(
    startTime: string,
    duration: number,
    completedDuration: number,
    isCompleted: boolean
  ): Promise<void> {
    await this.initialize();

    const date = new Date(startTime).toISOString().split("T")[0];
    const session: FocusSession = {
      id: `${Date.now()}-${Math.random()}`,
      startTime,
      duration,
      completedDuration,
      isCompleted,
      endTime: new Date().toISOString(),
    };

    if (!this.cache[date]) {
      this.cache[date] = [];
    }

    this.cache[date].push(session);
    await this.save();
  }

  /**
   * Get all sessions for a specific date
   */
  async getSessionsForDate(date: string): Promise<FocusSession[]> {
    await this.initialize();
    return this.cache[date] || [];
  }

  /**
   * Get total completed sessions count
   */
  async getTotalCompletedSessions(): Promise<number> {
    await this.initialize();

    let count = 0;
    for (const date in this.cache) {
      count += this.cache[date].filter((s) => s.isCompleted).length;
    }

    return count;
  }

  /**
   * Get total focus time (in seconds)
   */
  async getTotalFocusTime(): Promise<number> {
    await this.initialize();

    let totalSeconds = 0;
    for (const date in this.cache) {
      totalSeconds += this.cache[date].reduce(
        (sum, session) => sum + session.completedDuration,
        0
      );
    }

    return totalSeconds;
  }

  /**
   * Get average session length (in seconds)
   */
  async getAverageSessionLength(): Promise<number> {
    await this.initialize();

    const completedSessions: FocusSession[] = [];
    for (const date in this.cache) {
      completedSessions.push(...this.cache[date].filter((s) => s.isCompleted));
    }

    if (completedSessions.length === 0) return 0;

    const totalDuration = completedSessions.reduce(
      (sum, session) => sum + session.completedDuration,
      0
    );

    return Math.round(totalDuration / completedSessions.length);
  }

  /**
   * Get all sessions
   */
  async getAllSessions(): Promise<FocusSessionHistory> {
    await this.initialize();
    return this.cache;
  }

  /**
   * Clear all sessions
   */
  async clearAllSessions(): Promise<void> {
    await this.initialize();
    this.cache = {};
    await AsyncStorage.removeItem(STORAGE_KEY);
    await this.clearActiveSession();
    this.notifyListeners();
  }

  /**
   * Subscribe to changes
   */
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

export const deepFocusStorageManager = DeepFocusStorageManager.getInstance();
