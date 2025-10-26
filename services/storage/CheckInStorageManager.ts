import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "check_in_data";

export interface MorningCheckIn {
  completed: boolean;
  timestamp: string;
}

export interface EveningCheckIn {
  completed: boolean;
  timestamp: string;
  totalTasks: number;
  completedTasks: number;
  completedTaskIds: number[];
  dayMood?: string; // emoji
  journal?: string;
  imageRefs?: string[]; // URI references only
}

export interface WeightEntry {
  value: string; // numeric value as string (e.g., "170")
  unit: "kg" | "lbs";
  timestamp: string;
}

export interface DailyCheckIn {
  morning?: MorningCheckIn;
  evening?: EveningCheckIn;
  weight?: WeightEntry[];
}

export interface CheckInData {
  [date: string]: DailyCheckIn;
}

class CheckInStorageManager {
  private static instance: CheckInStorageManager;
  private cache: CheckInData = {};
  private isInitialized = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): CheckInStorageManager {
    if (!CheckInStorageManager.instance) {
      CheckInStorageManager.instance = new CheckInStorageManager();
    }
    return CheckInStorageManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      this.cache = data ? JSON.parse(data) : {};
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize CheckInStorageManager:", error);
      this.cache = {};
      this.isInitialized = true;
    }
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save check-in data:", error);
      throw error;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async getCheckInStatus(date: string): Promise<DailyCheckIn> {
    await this.initialize();
    const checkIn = this.cache[date];
    return checkIn ? JSON.parse(JSON.stringify(checkIn)) : {};
  }

  async hasMorningCheckIn(date: string): Promise<boolean> {
    await this.initialize();
    return this.cache[date]?.morning?.completed || false;
  }

  async hasEveningCheckIn(date: string): Promise<boolean> {
    await this.initialize();
    return this.cache[date]?.evening?.completed || false;
  }

  async completeMorningCheckIn(date: string): Promise<void> {
    await this.initialize();

    if (!this.cache[date]) {
      this.cache[date] = {};
    }

    this.cache[date].morning = {
      completed: true,
      timestamp: new Date().toISOString(),
    };

    await this.save();
  }

  async completeEveningCheckIn(
    date: string,
    data: {
      totalTasks: number;
      completedTasks: number;
      completedTaskIds: number[];
      dayMood?: string;
      journal?: string;
      imageRefs?: string[];
    }
  ): Promise<void> {
    await this.initialize();

    if (!this.cache[date]) {
      this.cache[date] = {};
    }

    this.cache[date].evening = {
      completed: true,
      timestamp: new Date().toISOString(),
      ...data,
    };

    await this.save();
  }

  async getDailySummary(date: string): Promise<EveningCheckIn | null> {
    await this.initialize();
    const evening = this.cache[date]?.evening;
    return evening ? { ...evening } : null;
  }

  async logWeight(
    date: string,
    value: string,
    unit: "kg" | "lbs"
  ): Promise<void> {
    await this.initialize();

    if (!this.cache[date]) {
      this.cache[date] = {};
    }

    if (!this.cache[date].weight) {
      this.cache[date].weight = [];
    }

    this.cache[date].weight!.push({
      value,
      unit,
      timestamp: new Date().toISOString(),
    });

    await this.save();
  }

  async getWeightHistory(date: string): Promise<WeightEntry[]> {
    await this.initialize();
    const weight = this.cache[date]?.weight;
    return weight ? [...weight] : [];
  }

  async getAllSummaries(): Promise<
    { date: string; summary: EveningCheckIn }[]
  > {
    await this.initialize();

    return Object.entries(this.cache)
      .filter(([_, checkIn]) => checkIn.evening?.completed)
      .map(([date, checkIn]) => ({
        date,
        summary: checkIn.evening!,
      }))
      .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
  }

  async clearData(): Promise<void> {
    await this.initialize();
    this.cache = {};
    await AsyncStorage.removeItem(STORAGE_KEY);
    this.notifyListeners();
  }

  // Deprecated: Use clearData() instead
  async clearAll(): Promise<void> {
    await this.clearData();
  }

  async getCache(): Promise<CheckInData> {
    await this.initialize();
    return JSON.parse(JSON.stringify(this.cache));
  }

  async restoreCache(data: CheckInData): Promise<void> {
    await this.initialize();
    this.cache = data;
    await this.save();
  }
}

export const checkInStorageManager = CheckInStorageManager.getInstance();
