export type NotificationType = "success" | "error" | "info" | "warning" | "vital";

export type VitalType = "discipline" | "mindset" | "strength" | "momentum" | "confidence" | "society";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // in milliseconds, default 5000
}

export interface VitalNotification extends Notification {
  type: "vital";
  vitalType: VitalType;
  amount: number;
  currentScore: number;
  previousScore: number;
}

export interface NotificationContextType {
  notifications: (Notification | VitalNotification)[];
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  addVitalNotification: (
    vitalType: VitalType,
    amount: number,
    currentScore: number,
    previousScore: number,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}
