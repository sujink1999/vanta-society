import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'task_completions';

export type TaskStatus = 'done' | 'skipped';

export interface TaskCompletion {
  status: TaskStatus;
  timestamp: string;
}

export interface TaskCompletionData {
  [date: string]: {
    [userRoutineId: string]: TaskCompletion;
  };
}

class TaskStorageManager {
  private static instance: TaskStorageManager;
  private cache: TaskCompletionData = {};
  private isInitialized = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): TaskStorageManager {
    if (!TaskStorageManager.instance) {
      TaskStorageManager.instance = new TaskStorageManager();
    }
    return TaskStorageManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      this.cache = data ? JSON.parse(data) : {};
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize TaskStorageManager:', error);
      this.cache = {};
      this.isInitialized = true;
    }
  }

  async getTaskStatus(date: string, userRoutineId: number): Promise<TaskStatus | null> {
    await this.initialize();
    return this.cache[date]?.[userRoutineId.toString()]?.status || null;
  }

  async getTaskCompletion(date: string, userRoutineId: number): Promise<TaskCompletion | null> {
    await this.initialize();
    const completion = this.cache[date]?.[userRoutineId.toString()];
    return completion ? { ...completion } : null;
  }

  async setTaskStatus(date: string, userRoutineId: number, status: TaskStatus): Promise<void> {
    await this.initialize();

    if (!this.cache[date]) {
      this.cache[date] = {};
    }

    this.cache[date][userRoutineId.toString()] = {
      status,
      timestamp: new Date().toISOString(),
    };
    await this.saveToStorage();
    this.notifyListeners();
  }

  async removeTaskStatus(date: string, userRoutineId: number): Promise<void> {
    await this.initialize();

    if (this.cache[date]) {
      delete this.cache[date][userRoutineId.toString()];

      // Remove date entry if empty
      if (Object.keys(this.cache[date]).length === 0) {
        delete this.cache[date];
      }

      await this.saveToStorage();
      this.notifyListeners();
    }
  }

  async getCompletionsForDate(date: string): Promise<{ [userRoutineId: string]: TaskCompletion }> {
    await this.initialize();
    return { ...(this.cache[date] || {}) };
  }

  async getDailyStats(date: string): Promise<{ done: number; skipped: number }> {
    await this.initialize();
    const dayData = this.cache[date] || {};

    const stats = { done: 0, skipped: 0 };
    Object.values(dayData).forEach(completion => {
      if (completion.status === 'done') stats.done++;
      if (completion.status === 'skipped') stats.skipped++;
    });

    return stats;
  }

  async getAllCompletions(): Promise<TaskCompletionData> {
    await this.initialize();
    return JSON.parse(JSON.stringify(this.cache));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save task completions:', error);
    }
  }

  async restoreCache(data: TaskCompletionData): Promise<void> {
    await this.initialize();
    this.cache = data;
    await this.saveToStorage();
    this.notifyListeners();
  }

  async clearData(): Promise<void> {
    await this.initialize();
    this.cache = {};
    await AsyncStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }
}

export const taskStorageManager = TaskStorageManager.getInstance();