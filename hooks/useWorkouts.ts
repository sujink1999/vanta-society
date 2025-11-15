import { WorkoutSession, WorkoutStats } from '@/services/api/types';
import { workoutStorageManager } from '@/services/storage/WorkoutStorageManager';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

interface UseWorkoutsReturn {
  workouts: WorkoutSession[];
  stats: WorkoutStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getUserExerciseHistory: () => Promise<string[]>;
}

export function useWorkouts(): UseWorkoutsReturn {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalSessions: 0,
    totalDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    breakdownByType: {
      strength: 0,
      cardio: 0,
      flexibility: 0,
      sports: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = (workoutList: WorkoutSession[]): WorkoutStats => {
    const totalSessions = workoutList.length;
    const totalDuration = workoutList.reduce((sum, w) => sum + w.duration, 0);

    // Calculate breakdown by type
    const breakdownByType = workoutList.reduce(
      (acc, w) => {
        acc[w.type] = (acc[w.type] || 0) + 1;
        return acc;
      },
      { strength: 0, cardio: 0, flexibility: 0, sports: 0 }
    );

    // Calculate streak (consecutive days with workouts)
    const sortedDates = Array.from(
      new Set(workoutList.map((w) => moment(w.date).format('YYYY-MM-DD')))
    ).sort((a, b) => moment(b).diff(moment(a)));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let expectedDate = moment();

    for (const dateStr of sortedDates) {
      const date = moment(dateStr);

      if (date.isSame(expectedDate, 'day')) {
        tempStreak++;
        if (expectedDate.isSame(moment(), 'day') || expectedDate.isSame(moment().subtract(1, 'day'), 'day')) {
          currentStreak = tempStreak;
        }
        expectedDate = expectedDate.subtract(1, 'day');
      } else if (date.isBefore(expectedDate.subtract(1, 'day'), 'day')) {
        // Gap in streak
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
        expectedDate = date.clone().subtract(1, 'day');
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    return {
      totalSessions,
      totalDuration,
      currentStreak,
      longestStreak,
      breakdownByType,
    };
  };

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await workoutStorageManager.initialize();
      const allWorkouts = await workoutStorageManager.getAllWorkouts();

      setWorkouts(allWorkouts);
      setStats(calculateStats(allWorkouts));
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserExerciseHistory = useCallback(async () => {
    return await workoutStorageManager.getUserExerciseHistory();
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return {
    workouts,
    stats,
    loading,
    error,
    refetch: fetchWorkouts,
    getUserExerciseHistory,
  };
}
