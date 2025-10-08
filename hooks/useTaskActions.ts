import { useGlobalContext } from "@/contexts/GlobalContext";
import { dataSyncManager } from "@/services/storage/DataSyncManager";
import { scoreStorageManager } from "@/services/storage/ScoreStorageManager";
import { taskStorageManager } from "@/services/storage/TaskStorageManager";
import { useState } from "react";

export function useTaskActions(date: string) {
  const { routine, addNotification } = useGlobalContext();
  const [loading, setLoading] = useState<{ [taskId: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const markTaskDone = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading((prev) => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Find the task in routine to get impact values
      const task = routine.find((r) => r.id === userRoutineId);

      if (!task) {
        throw new Error("Task not found in routine");
      }

      // Update local storage for task completion
      await taskStorageManager.setTaskStatus(date, userRoutineId, "done");

      // Update local scores with task impacts
      const scoreImpacts = {
        discipline: task.disciplineImpact || 0,
        mindset: task.mindsetImpact || 0,
        strength: task.strengthImpact || 0,
        momentum: task.momentumImpact || 0,
        confidence: task.confidenceImpact || 0,
      };

      await scoreStorageManager.incrementMultipleScores(scoreImpacts);

      // Trigger background sync to backend
      dataSyncManager.syncToBackend().catch((err) => {
        console.warn("Background sync failed:", err);
        // Don't fail the operation if sync fails
      });

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to complete task";
      setError(errorMessage);
      console.error("Failed to complete task:", err);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, [taskKey]: false }));
    }
  };

  const skipTask = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading((prev) => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Skip is frontend-only, just update local storage
      await taskStorageManager.setTaskStatus(date, userRoutineId, "skipped");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to skip task";
      setError(errorMessage);
      console.error("Failed to skip task:", err);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, [taskKey]: false }));
    }
  };

  const undoTaskAction = async (userRoutineId: number) => {
    const taskKey = userRoutineId.toString();
    setLoading((prev) => ({ ...prev, [taskKey]: true }));
    setError(null);

    try {
      // Check if task was completed (only decrement scores if it was 'done')
      const taskStatus = await taskStorageManager.getTaskStatus(
        date,
        userRoutineId
      );

      if (taskStatus === "done") {
        // Find the task in routine to get impact values
        const task = routine.find((r) => r.id === userRoutineId);

        if (task) {
          // Decrement scores by negating the impacts
          const scoreImpacts = {
            discipline: -(task.disciplineImpact || 0),
            mindset: -(task.mindsetImpact || 0),
            strength: -(task.strengthImpact || 0),
            momentum: -(task.momentumImpact || 0),
            confidence: -(task.confidenceImpact || 0),
          };

          await scoreStorageManager.incrementMultipleScores(scoreImpacts);

          // Trigger background sync to backend
          dataSyncManager.syncToBackend().catch((err) => {
            console.warn("Background sync failed:", err);
          });
        }
      }

      // Remove from local storage (this moves it back to todos)
      await taskStorageManager.removeTaskStatus(date, userRoutineId);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to undo task action";
      setError(errorMessage);
      console.error("Failed to undo task action:", err);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, [taskKey]: false }));
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
