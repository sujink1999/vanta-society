import { useGlobalContext } from "@/contexts/GlobalContext";
import { completeTask } from "@/services/api/completions";
import { taskStorageManager } from "@/services/storage/TaskStorageManager";
import { useState } from "react";

export function useTaskActions(date: string) {
  const { refetchUserSilently } = useGlobalContext();
  const [loading, setLoading] = useState<{ [taskId: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const markTaskDone = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading(prev => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Call backend API first
      await completeTask({ userRoutineId });

      // If API call succeeds, update local storage
      await taskStorageManager.setTaskStatus(date, userRoutineId, 'done');

      // Refetch user data silently to update scores
      await refetchUserSilently();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task';
      setError(errorMessage);
      console.error('Failed to complete task:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [taskKey]: false }));
    }
  };

  const skipTask = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading(prev => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Skip is frontend-only, just update local storage
      await taskStorageManager.setTaskStatus(date, userRoutineId, 'skipped');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to skip task';
      setError(errorMessage);
      console.error('Failed to skip task:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [taskKey]: false }));
    }
  };

  const undoTaskAction = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading(prev => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Remove from local storage (this moves it back to todos)
      await taskStorageManager.removeTaskStatus(date, userRoutineId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to undo task action';
      setError(errorMessage);
      console.error('Failed to undo task action:', err);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [taskKey]: false }));
    }
  };

  const isTaskLoading = (userRoutineId: number) => {
    return loading[userRoutineId.toString()] || false;
  };

  const clearError = () => {
    setError(null);
  };

  return {
    markTaskDone,
    skipTask,
    undoTaskAction,
    isTaskLoading,
    error,
    clearError,
  };
}