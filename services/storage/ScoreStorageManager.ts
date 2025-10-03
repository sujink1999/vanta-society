import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'user_scores';

export interface VitalScores {
  discipline: number;
  mindset: number;
  strength: number;
  momentum: number;
  confidence: number;
  society: number;
}

class ScoreStorageManager {
  private static instance: ScoreStorageManager;
  private cache: VitalScores | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ScoreStorageManager {
    if (!ScoreStorageManager.instance) {
      ScoreStorageManager.instance = new ScoreStorageManager();
    }
    return ScoreStorageManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      this.cache = data ? JSON.parse(data) : null;
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ScoreStorageManager:', error);
      this.cache = null;
      this.isInitialized = true;
    }
  }

  async getScores(): Promise<VitalScores | null> {
    await this.initialize();
    return this.cache;
  }

  async updateScores(scores: VitalScores): Promise<void> {
    await this.initialize();
    this.cache = scores;
    await this.saveToStorage();
  }

  async incrementScore(vital: keyof Omit<VitalScores, 'society'>, amount: number): Promise<VitalScores> {
    await this.initialize();

    if (!this.cache) {
      throw new Error('Scores not initialized. Call initializeScores first.');
    }

    // Update the specific vital
    this.cache[vital] = Math.min(100, this.cache[vital] + amount);

    // Recalculate society score (average of all 5 vitals)
    this.cache.society = (
      this.cache.discipline +
      this.cache.mindset +
      this.cache.strength +
      this.cache.momentum +
      this.cache.confidence
    ) / 5;

    await this.saveToStorage();
    return this.cache;
  }

  async incrementMultipleScores(impacts: {
    discipline?: number;
    mindset?: number;
    strength?: number;
    momentum?: number;
    confidence?: number;
  }): Promise<VitalScores> {
    await this.initialize();

    if (!this.cache) {
      throw new Error('Scores not initialized. Call initializeScores first.');
    }

    // Update each vital if impact provided
    if (impacts.discipline) this.cache.discipline = Math.min(100, this.cache.discipline + impacts.discipline);
    if (impacts.mindset) this.cache.mindset = Math.min(100, this.cache.mindset + impacts.mindset);
    if (impacts.strength) this.cache.strength = Math.min(100, this.cache.strength + impacts.strength);
    if (impacts.momentum) this.cache.momentum = Math.min(100, this.cache.momentum + impacts.momentum);
    if (impacts.confidence) this.cache.confidence = Math.min(100, this.cache.confidence + impacts.confidence);

    // Recalculate society score
    this.cache.society = (
      this.cache.discipline +
      this.cache.mindset +
      this.cache.strength +
      this.cache.momentum +
      this.cache.confidence
    ) / 5;

    await this.saveToStorage();
    return this.cache;
  }

  async initializeScores(initialScores: VitalScores): Promise<void> {
    await this.initialize();
    this.cache = initialScores;
    await this.saveToStorage();
  }

  async clearScores(): Promise<void> {
    await this.initialize();
    this.cache = null;
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save scores:', error);
    }
  }
}

export const scoreStorageManager = ScoreStorageManager.getInstance();
