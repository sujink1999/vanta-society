import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { Animated, Text } from "react-native";

interface BedtimeReminderProps {
  fadeAnim: Animated.Value;
  onComplete: () => void;
}

export function BedtimeReminder({
  fadeAnim,
  onComplete,
}: BedtimeReminderProps) {
  const { routine } = useGlobalContext();

  const idealBedtime = useMemo(() => {
    if (!routine || routine.length === 0) {
      return null;
    }

    // Find wake time from routine tasks (look for tasks with time options)
    for (const task of routine) {
      if (task.taskName.toLowerCase().includes("wake")) {
        const timeOption = task.optionsSet.find(
          (opt) =>
            opt.type === "time" || opt.name.toLowerCase().includes("time")
        );
        if (timeOption && timeOption.value) {
          // Parse wake time (format: "6:00 AM", "6:30 PM", etc.)
          const wakeTime = moment(timeOption.value, [
            "h:mm A",
            "h:mm a",
            "hh:mm A",
            "hh:mm a",
          ]);
          if (wakeTime.isValid()) {
            // Calculate bedtime: wake time - 9 hours (8 hours sleep + 1 hour buffer)
            const bedtime = wakeTime.clone().subtract(8.5, "hours");
            return bedtime.format("h:mm A");
          }
        }
      }
    }

    // Default bedtime if no wake time found
    return "10:00 PM";
  }, [routine]);

  useEffect(() => {
    // Auto-complete after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Animated.View
      style={[
        tw`justify-center items-center px-6 min-h-[250px]`,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={tw`text-white/60 font-mont text-base mb-4 text-center`}>
        Your ideal bedtime tonight is
      </Text>
      <Text style={tw`text-primary font-tussi-bold text-4xl mb-4`}>
        {idealBedtime}
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm text-center px-8`}>
        Get 8 hours of quality sleep to crush tomorrow
      </Text>
    </Animated.View>
  );
}
