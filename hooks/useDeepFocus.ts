import { deepFocusStorageManager } from "@/services/storage/DeepFocusStorageManager";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseDeepFocusReturn {
  timeRemaining: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  progress: number; // 0-1
  start: (durationMinutes: number) => void;
  pause: () => void;
  resume: () => void;
  stop: (reason?: "manual" | "navigation" | "completion") => void;
}

export function useDeepFocus(): UseDeepFocusReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Calculate progress (0-1)
  const progress = totalDuration > 0 ? 1 - timeRemaining / totalDuration : 0;

  // Clear interval helper
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start timer
  const start = useCallback((durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    setTimeRemaining(durationSeconds);
    setTotalDuration(durationSeconds);
    setIsActive(true);
    setIsPaused(false);

    const now = new Date().toISOString();
    startTimeRef.current = now;
    sessionIdRef.current = `${Date.now()}-${Math.random()}`;

    // Save active session
    deepFocusStorageManager.saveActiveSession({
      id: sessionIdRef.current,
      startTime: now,
      duration: durationSeconds,
      remainingTime: durationSeconds,
      isPaused: false,
    });

    // Light haptic on start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    if (!isActive || isPaused) return;

    setIsPaused(true);
    clearTimerInterval();

    // Save paused state
    if (sessionIdRef.current && startTimeRef.current) {
      deepFocusStorageManager.saveActiveSession({
        id: sessionIdRef.current,
        startTime: startTimeRef.current,
        duration: totalDuration,
        remainingTime: timeRemaining,
        isPaused: true,
        lastPauseTime: new Date().toISOString(),
      });
    }

    // Light haptic on pause
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isActive, isPaused, timeRemaining, totalDuration, clearTimerInterval]);

  // Resume timer
  const resume = useCallback(() => {
    if (!isActive || !isPaused) return;

    setIsPaused(false);

    // Save resumed state
    if (sessionIdRef.current && startTimeRef.current) {
      deepFocusStorageManager.saveActiveSession({
        id: sessionIdRef.current,
        startTime: startTimeRef.current,
        duration: totalDuration,
        remainingTime: timeRemaining,
        isPaused: false,
      });
    }

    // Light haptic on resume
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isActive, isPaused, timeRemaining, totalDuration]);

  // Stop timer (manually, on navigation, or completion)
  const stop = useCallback(
    async (reason: "manual" | "navigation" | "completion" = "manual") => {
      clearTimerInterval();

      if (isActive && startTimeRef.current) {
        const completedDuration = totalDuration - timeRemaining;
        const isCompleted = reason === "completion";

        // Log session to history
        await deepFocusStorageManager.logSession(
          startTimeRef.current,
          totalDuration,
          completedDuration,
          isCompleted
        );

        // Clear active session
        await deepFocusStorageManager.clearActiveSession();
      }

      setIsActive(false);
      setIsPaused(false);
      setTimeRemaining(0);
      setTotalDuration(0);
      startTimeRef.current = null;
      sessionIdRef.current = null;

      // Success haptic on completion
      if (reason === "completion") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [isActive, timeRemaining, totalDuration, clearTimerInterval]
  );

  // Timer interval effect
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer completed
            stop("completion");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimerInterval();
    }
  }, [isActive, isPaused, stop, clearTimerInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  return {
    timeRemaining,
    isActive,
    isPaused,
    progress,
    start,
    pause,
    resume,
    stop,
  };
}
