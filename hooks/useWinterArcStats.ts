import { User, UserRoutine } from "@/services/api/types";
import { taskStorageManager } from "@/services/storage/TaskStorageManager";
import { scoreStorageManager } from "@/services/storage/ScoreStorageManager";
import moment from "moment";
import { useEffect, useState } from "react";

interface WinterArcStats {
  currentScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  oldScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  potentialScores: {
    discipline: number;
    mindset: number;
    strength: number;
    momentum: number;
    confidence: number;
    society: number;
  };
  streak: number;
  streakCadenceLast7Days: number[]; // [0,0,1,1,1,1,1] for last 7 days
  tasksCompletedCumulative: number[]; // cumulative count of completed tasks per day, index 0 = day 1
  isLoading: boolean;
}

export function useWinterArcStats(
  user: User | null,
  routine: UserRoutine[] = []
): WinterArcStats {
  const [stats, setStats] = useState<WinterArcStats>({
    currentScores: {
      discipline: 0,
      mindset: 0,
      strength: 0,
      momentum: 0,
      confidence: 0,
      society: 0,
    },
    oldScores: {
      discipline: 0,
      mindset: 0,
      strength: 0,
      momentum: 0,
      confidence: 0,
      society: 0,
    },
    potentialScores: {
      discipline: 0,
      mindset: 0,
      strength: 0,
      momentum: 0,
      confidence: 0,
      society: 0,
    },
    streak: 0,
    streakCadenceLast7Days: [0, 0, 0, 0, 0, 0, 0],
    tasksCompletedCumulative: [],
    isLoading: true,
  });

  useEffect(() => {
    const calculateStats = async () => {
      setStats((prev) => ({ ...prev, isLoading: true }));
      if (!user?.winterArcStartDate) {
        setStats((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const startDate = moment(user.winterArcStartDate);
        const today = moment();
        const currentDay = Math.max(
          1,
          Math.min(66, today.diff(startDate, "days") + 1)
        );

        // Get scores from local storage
        const localScores = await scoreStorageManager.getScores();
        const currentScores = localScores || {
          discipline: 0,
          mindset: 0,
          strength: 0,
          momentum: 0,
          confidence: 0,
          society: 0,
        };

        const oldScores = {
          discipline: user.initialDisciplineScore || 0,
          mindset: user.initialMindsetScore || 0,
          strength: user.initialStrengthScore || 0,
          momentum: user.initialMomentumScore || 0,
          confidence: user.initialConfidenceScore || 0,
          society: user.societyScore || 0, // No initial society score in types
        };

        // Get all completions at once and parse
        const allCompletions = await taskStorageManager.getAllCompletions();

        // Build cumulative array of tasks completed per day
        const tasksCompletedCumulative: number[] = [];
        let cumulativeTotal = 0;

        for (let day = 1; day <= currentDay; day++) {
          const date = startDate
            .clone()
            .add(day - 1, "days")
            .format("YYYY-MM-DD");
          const dayTasks = allCompletions[date] || {};
          const doneCount = Object.values(dayTasks).filter(
            (completion) => completion.status === "done"
          ).length;

          cumulativeTotal += doneCount;
          tasksCompletedCumulative.push(cumulativeTotal);
        }

        // Calculate current streak (consecutive days with at least 1 task completed)
        // Check if today has any completed tasks
        const todayDate = today.format("YYYY-MM-DD");
        const todayTasks = allCompletions[todayDate] || {};
        const todayCompletedCount = Object.values(todayTasks).filter(
          (completion) => completion.status === "done"
        ).length;

        let streak = 0;
        // Start from current day if today has completions, otherwise yesterday
        const startDay = todayCompletedCount > 0 ? currentDay : currentDay - 1;

        for (let day = startDay; day >= 1; day--) {
          const date = startDate
            .clone()
            .add(day - 1, "days")
            .format("YYYY-MM-DD");
          const dayTasks = allCompletions[date] || {};
          const completedCount = Object.values(dayTasks).filter(
            (completion) => completion.status === "done"
          ).length;

          if (completedCount > 0) {
            streak++;
          } else {
            break;
          }
        }

        // Calculate streak cadence for last 7 days
        const streakCadenceLast7Days: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = today.clone().subtract(i, "days").format("YYYY-MM-DD");
          const dayTasks = allCompletions[date] || {};
          const completedCount = Object.values(dayTasks).filter(
            (completion) => completion.status === "done"
          ).length;
          streakCadenceLast7Days.push(completedCount > 0 ? 1 : 0);
        }

        // Calculate potential scores - what scores would be if user completes all remaining tasks
        const calculatePotentialScores = () => {
          if (!routine || routine.length === 0) return currentScores;

          // Calculate total potential gains from remaining tasks
          let totalPotentialGains = {
            control: currentScores.discipline || 0,
            clarity: currentScores.mindset || 0,
            power: currentScores.strength || 0,
            flow: currentScores.momentum || 0,
            aura: currentScores.confidence || 0,
          };

          // For each remaining day, calculate potential gains from all active tasks
          for (let day = currentDay; day <= 66; day++) {
            const dayDate = startDate.clone().add(day - 1, "days");
            const dayOfWeek = dayDate.day();
            const cadenceIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            routine.forEach((task: UserRoutine) => {
              if (task.isActive && task.cadence[cadenceIndex] === 1) {
                // Only add if not already completed
                const dateStr = dayDate.format("YYYY-MM-DD");
                // Assume task not completed if we don't have detailed task completion data
                totalPotentialGains.control += task.controlImpact || 0;
                totalPotentialGains.clarity += task.clarityImpact || 0;
                totalPotentialGains.power += task.powerImpact || 0;
                totalPotentialGains.flow += task.flowImpact || 0;
                totalPotentialGains.aura += task.auraImpact || 0;
              }
            });
          }

          const societyScore =
            Object.values(totalPotentialGains).reduce(
              (acc, curr) => acc + curr,
              0
            ) / 5;

          return {
            discipline: Math.min(
              100,
              (currentScores.discipline || 0) + totalPotentialGains.control
            ),
            mindset: Math.min(
              100,
              (currentScores.mindset || 0) + totalPotentialGains.clarity
            ),
            strength: Math.min(
              100,
              (currentScores.strength || 0) + totalPotentialGains.power
            ),
            momentum: Math.min(
              100,
              (currentScores.momentum || 0) + totalPotentialGains.flow
            ),
            confidence: Math.min(
              100,
              (currentScores.confidence || 0) + totalPotentialGains.aura
            ),
            society: Math.min(100, (currentScores.society || 0) + societyScore),
          };
        };

        const potentialScores = calculatePotentialScores();

        setStats({
          currentScores,
          oldScores,
          potentialScores,
          streak,
          streakCadenceLast7Days,
          tasksCompletedCumulative,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to calculate Winter Arc stats:", error);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    calculateStats();

    // Subscribe to storage changes
    const unsubscribeScore = scoreStorageManager.subscribe(() => {
      calculateStats();
    });

    const unsubscribeTask = taskStorageManager.subscribe(() => {
      calculateStats();
    });

    return () => {
      unsubscribeScore();
      unsubscribeTask();
    };
  }, [user, routine]);

  return stats;
}
