import { useGlobalContext } from "@/contexts/GlobalContext";
import { UserRoutine } from "@/services/api/types";
import { TaskStatus, TaskCompletion, taskStorageManager } from "@/services/storage/TaskStorageManager";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

export interface TaskForDate extends UserRoutine {
  isScheduledForDate: boolean;
  status: TaskStatus | null;
}

export function useTasks(date: string, filterBy?: 'todos' | 'done' | 'skipped'): TaskForDate[] {
  const { routine } = useGlobalContext();
  const [completionData, setCompletionData] = useState<{ [userRoutineId: string]: TaskCompletion }>({});

  // Load completion data for the date
  useEffect(() => {
    const loadCompletions = async () => {
      const data = await taskStorageManager.getCompletionsForDate(date);
      setCompletionData(data);
    };
    loadCompletions();

    // Subscribe to task storage changes
    const unsubscribe = taskStorageManager.subscribe(() => {
      loadCompletions();
    });

    return () => {
      unsubscribe();
    };
  }, [date]);

  const tasksForDate = useMemo(() => {
    if (!routine || routine.length === 0) {
      return [];
    }

    const targetDate = moment(date);
    const momentDayOfWeek = targetDate.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Convert moment day (0=Sunday, 1=Monday, ..., 6=Saturday)
    // to cadence index (0=Monday, 1=Tuesday, ..., 6=Sunday)
    const cadenceIndex = momentDayOfWeek === 0 ? 6 : momentDayOfWeek - 1;

    const allTasks = routine
      .filter((task) => task.isActive) // Only include active tasks
      .map((task) => ({
        ...task,
        isScheduledForDate: task.cadence[cadenceIndex] === 1, // Check if task is scheduled for this day
        status: completionData[task.id.toString()]?.status || null,
      }))
      .filter((task) => task.isScheduledForDate); // Only return tasks scheduled for this date

    // Apply filter if specified
    if (filterBy) {
      switch (filterBy) {
        case 'todos':
          return allTasks.filter((task) => !task.status);
        case 'done':
          return allTasks.filter((task) => task.status === 'done');
        case 'skipped':
          return allTasks.filter((task) => task.status === 'skipped');
        default:
          return allTasks;
      }
    }

    return allTasks;
  }, [routine, date, completionData, filterBy]);

  return tasksForDate;
}

// Hook to refresh completion data (used after task completion/skip)
export function useRefreshTasks() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { refresh, refreshKey };
}