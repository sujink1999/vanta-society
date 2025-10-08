import {
  Notification,
  NotificationType,
  VitalNotification,
  VitalType,
} from "@/types/notification";
import { useCallback, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<
    (Notification | VitalNotification)[]
  >([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      duration: number = 3000
    ) => {
      const id = `${Date.now()}-${Math.random()}`;

      const notification: Notification = {
        id,
        message,
        type,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      return id;
    },
    []
  );

  const addVitalNotification = useCallback(
    (
      vitalType: VitalType,
      amount: number,
      currentScore: number,
      previousScore: number,
      duration: number = 3000
    ) => {
      const id = `${Date.now()}-${Math.random()}`;

      const notification: VitalNotification = {
        id,
        message: "", // Not used for vital notifications
        type: "vital",
        vitalType,
        amount,
        currentScore,
        previousScore,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      return id;
    },
    []
  );

  return {
    notifications,
    addNotification,
    addVitalNotification,
    removeNotification,
  };
}
