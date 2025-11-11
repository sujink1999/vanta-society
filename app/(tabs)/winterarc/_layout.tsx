import { useGlobalContext } from "@/contexts/GlobalContext";
import { notificationScheduler } from "@/services/notifications/NotificationScheduler";
import { Stack } from "expo-router";
import moment from "moment";
import { useEffect } from "react";

export default function WinterArcLayout() {
  const { user } = useGlobalContext();

  // Initialize notifications based on Project66 status
  useEffect(() => {
    if (!user || !user.winterArcStartDate) return;

    if (user.winterArcStartDate) {
      const startDate = moment(user.winterArcStartDate).startOf("day");
      const today = moment().startOf("day");
      const hasStarted = startDate.isSameOrBefore(today);

      notificationScheduler.initialize().then(() => {
        if (hasStarted) {
          // Project66 has started - send 4x daily motivational notifications
          notificationScheduler.scheduleDailyNotifications();
        } else {
          // Project66 hasn't started - send countdown notifications
          notificationScheduler.scheduleCountdownNotifications(
            user.winterArcStartDate as string
          );
        }
      });
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="routine-editor" />
    </Stack>
  );
}
