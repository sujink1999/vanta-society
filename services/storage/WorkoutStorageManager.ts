import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession } from '../api/types';

const WORKOUTS_KEY = 'workouts_cache';

class WorkoutStorageManager {
  private static instance: WorkoutStorageManager;
  private cache: Record<string, WorkoutSession> = {}; // keyed by workout.id

  private constructor() {}

  static getInstance(): WorkoutStorageManager {
    if (!WorkoutStorageManager.instance) {
      WorkoutStorageManager.instance = new WorkoutStorageManager();
    }
    return WorkoutStorageManager.instance;
  }

  /**
   * Initialize cache from AsyncStorage
   */
  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(WORKOUTS_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        console.log('Workouts cache loaded:', Object.keys(this.cache).length, 'workouts');
      }
    } catch (error) {
      console.error('Failed to load workouts cache:', error);
    }
  }

  /**
   * Save cache to AsyncStorage
   */
  private async saveCache(): Promise<void> {
    try {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save workouts cache:', error);
    }
  }

  /**
   * Save a new workout or update existing
   */
  async saveWorkout(workout: WorkoutSession): Promise<void> {
    this.cache[workout.id] = workout;
    await this.saveCache();
    console.log('Workout saved:', workout.id);
  }

  /**
   * Update an existing workout
   */
  async updateWorkout(id: string, updates: Partial<WorkoutSession>): Promise<void> {
    const existing = this.cache[id];
    if (!existing) {
      throw new Error(`Workout ${id} not found`);
    }

    this.cache[id] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveCache();
    console.log('Workout updated:', id);
  }

  /**
   * Delete a workout
   */
  async deleteWorkout(id: string): Promise<void> {
    delete this.cache[id];
    await this.saveCache();
    console.log('Workout deleted:', id);
  }

  /**
   * Get a single workout by ID
   */
  async getWorkout(id: string): Promise<WorkoutSession | null> {
    return this.cache[id] || null;
  }

  /**
   * Get all workouts
   */
  async getAllWorkouts(): Promise<WorkoutSession[]> {
    return Object.values(this.cache).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  /**
   * Get workouts within a date range
   */
  async getWorkouts(startDate: string, endDate: string): Promise<WorkoutSession[]> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return Object.values(this.cache)
      .filter(workout => {
        const workoutDate = new Date(workout.date).getTime();
        return workoutDate >= start && workoutDate <= end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Get workouts for a specific month
   */
  async getWorkoutsByMonth(year: number, month: number): Promise<WorkoutSession[]> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
    return this.getWorkouts(startDate, endDate);
  }

  /**
   * Get unique exercise names from user's workout history (for auto-complete)
   */
  async getUserExerciseHistory(): Promise<string[]> {
    const exerciseNames = new Set<string>();

    Object.values(this.cache).forEach(workout => {
      if (workout.type === 'strength' && workout.exercises) {
        workout.exercises.forEach(exercise => {
          exerciseNames.add(exercise.name);
        });
      }
    });

    return Array.from(exerciseNames).sort();
  }

  /**
   * Get the current workout cache (for syncing)
   */
  async getCache(): Promise<Record<string, WorkoutSession>> {
    return this.cache;
  }

  /**
   * Restore cache from backup
   */
  async restoreCache(data: Record<string, WorkoutSession>): Promise<void> {
    this.cache = data;
    await this.saveCache();
    console.log('Workouts restored from backup');
  }

  /**
   * Clear all workout data
   */
  async clearData(): Promise<void> {
    this.cache = {};
    await AsyncStorage.removeItem(WORKOUTS_KEY);
    console.log('All workout data cleared');
  }
}

export const workoutStorageManager = WorkoutStorageManager.getInstance();
