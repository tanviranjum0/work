/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useCallback, useEffect } from "react";

type UseCooldownTimerReturn = {
  timeLeft: number;
  isActive: boolean;
  startCooldown: () => void;
};

const useCooldownTimer = (
  cooldownDuration: number,
  storageKey: string,
): UseCooldownTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // ✅ Works in browser + Node types
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Start interval safely
   */
  const startInterval = useCallback((): void => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          localStorage.removeItem(storageKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [storageKey]);

  /**
   * Initialize from localStorage
   */
  useEffect(() => {
    const savedEndTime = localStorage.getItem(storageKey);

    if (!savedEndTime) return;

    const endTime = Number(savedEndTime);
    if (Number.isNaN(endTime)) {
      localStorage.removeItem(storageKey);
      return;
    }

    const currentTime = Date.now();
    const remaining = Math.max(0, Math.ceil((endTime - currentTime) / 1000));

    if (remaining > 0) {
      setTimeLeft(remaining);
      startInterval();
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, startInterval]);

  /**
   * Start cooldown
   */
  const startCooldown = useCallback((): void => {
    if (intervalRef.current) return;

    const endTime = Date.now() + cooldownDuration;
    localStorage.setItem(storageKey, endTime.toString());

    setTimeLeft(Math.ceil(cooldownDuration / 1000));
    startInterval();
  }, [cooldownDuration, storageKey, startInterval]);

  /**
   * Cleanup
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    isActive: timeLeft > 0,
    startCooldown,
  };
};

export default useCooldownTimer;
