import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect } from "react";
import { Animated, Text } from "react-native";

interface BedtimeReminderProps {
  fadeAnim: Animated.Value;
  onComplete: () => void;
}

export function BedtimeReminder({
  fadeAnim,
  onComplete,
}: BedtimeReminderProps) {
  const { winterArcStats } = useGlobalContext();

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
        {winterArcStats.idealBedtime}
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm text-center px-8`}>
        Get 8 hours of quality sleep to crush tomorrow
      </Text>
    </Animated.View>
  );
}
