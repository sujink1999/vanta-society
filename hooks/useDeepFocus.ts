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
  const startTimeRef = useRef<number | null>(null); // Changed to number (timestamp)
  const pausedTimeRef = useRef<number>(0); // Track total paused time in ms
  const pauseStartRef = useRef<number | null>(null); // When pause started
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

    const now = Date.now();
    startTimeRef.current = now;
    pausedTimeRef.current = 0;
    pauseStartRef.current = null;
    sessionIdRef.current = `${now}-${Math.random()}`;

    // Save active session
    deepFocusStorageManager.saveActiveSession({
      id: sessionIdRef.current,
      startTime: new Date(now).toISOString(),
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

    // Mark when pause started
    pauseStartRef.current = Date.now();

    // Save paused state
    if (sessionIdRef.current && startTimeRef.current) {
      deepFocusStorageManager.saveActiveSession({
        id: sessionIdRef.current,
        startTime: new Date(startTimeRef.current).toISOString(),
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

    // Calculate and add paused duration
    if (pauseStartRef.current !== null) {
      const pauseDuration = Date.now() - pauseStartRef.current;
      pausedTimeRef.current += pauseDuration;
      pauseStartRef.current = null;
    }

    // Save resumed state
    if (sessionIdRef.current && startTimeRef.current) {
      deepFocusStorageManager.saveActiveSession({
        id: sessionIdRef.current,
        startTime: new Date(startTimeRef.current).toISOString(),
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

      if (isActive) {
        // Clear active session
        await deepFocusStorageManager.clearActiveSession();
      }

      setIsActive(false);
      setIsPaused(false);
      setTimeRemaining(0);
      setTotalDuration(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      pauseStartRef.current = null;
      sessionIdRef.current = null;

      // Success haptic on completion
      if (reason === "completion") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [isActive, clearTimerInterval]
  );

  // Timer interval effect - calculates based on elapsed time
  useEffect(() => {
    if (isActive && !isPaused && startTimeRef.current !== null) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedMs = now - startTimeRef.current!;
        const totalPausedMs = pausedTimeRef.current;
        const activeElapsedMs = elapsedMs - totalPausedMs;
        const activeElapsedSeconds = Math.floor(activeElapsedMs / 1000);

        const remaining = totalDuration - activeElapsedSeconds;

        if (remaining <= 0) {
          // Timer completed
          setTimeRemaining(0);
          stop("completion");
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearTimerInterval();
    }
  }, [isActive, isPaused, totalDuration, stop, clearTimerInterval]);

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
