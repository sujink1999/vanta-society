import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_SESSION_KEY = "deep_focus_active_session";

export interface ActiveSession {
  id: string;
  startTime: string;
  duration: number;
  remainingTime: number; // in seconds
  isPaused: boolean;
  lastPauseTime?: string;
}

class DeepFocusStorageManager {
  private static instance: DeepFocusStorageManager;

  private constructor() {}

  static getInstance(): DeepFocusStorageManager {
    if (!DeepFocusStorageManager.instance) {
      DeepFocusStorageManager.instance = new DeepFocusStorageManager();
    }
    return DeepFocusStorageManager.instance;
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
}

export const deepFocusStorageManager = DeepFocusStorageManager.getInstance();
