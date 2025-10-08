import { Notification, NotificationType } from "@/types/notification";
import { useCallback, useState } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      duration: number = 5000
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

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
