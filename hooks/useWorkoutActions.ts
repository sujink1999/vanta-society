import { WorkoutSession } from '@/services/api/types';
import { dataSyncManager } from '@/services/storage/DataSyncManager';
import { workoutStorageManager } from '@/services/storage/WorkoutStorageManager';
import { useCallback, useState } from 'react';

interface UseWorkoutActionsReturn {
  logWorkout: (session: WorkoutSession) => Promise<boolean>;
  updateWorkout: (id: string, updates: Partial<WorkoutSession>) => Promise<boolean>;
  deleteWorkout: (id: string) => Promise<boolean>;
  isLogging: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

export function useWorkoutActions(): UseWorkoutActionsReturn {
  const [isLogging, setIsLogging] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logWorkout = useCallback(async (session: WorkoutSession): Promise<boolean> => {
    setIsLogging(true);
    setError(null);

    try {
      // Save to local storage
      await workoutStorageManager.saveWorkout(session);

      // Sync to backend
      await dataSyncManager.syncToBackend();

      console.log('Workout logged successfully:', session.id);
      return true;
    } catch (err) {
      console.error('Failed to log workout:', err);
      setError('Failed to save workout');
      return false;
    } finally {
      setIsLogging(false);
    }
  }, []);

  const updateWorkout = useCallback(
    async (id: string, updates: Partial<WorkoutSession>): Promise<boolean> => {
      setIsUpdating(true);
      setError(null);

      try {
        // Update in local storage
        await workoutStorageManager.updateWorkout(id, updates);

        // Sync to backend
        await dataSyncManager.syncToBackend();

        console.log('Workout updated successfully:', id);
        return true;
      } catch (err) {
        console.error('Failed to update workout:', err);
        setError('Failed to update workout');
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const deleteWorkout = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      // Delete from local storage
      await workoutStorageManager.deleteWorkout(id);

      // Sync to backend
      await dataSyncManager.syncToBackend();

      console.log('Workout deleted successfully:', id);
      return true;
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setError('Failed to delete workout');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    logWorkout,
    updateWorkout,
    deleteWorkout,
    isLogging,
    isUpdating,
    isDeleting,
    error,
  };
}
