import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import React, { useMemo } from "react";
import { Animated, Text, View } from "react-native";

interface DaySummaryProps {
  fadeAnim: Animated.Value;
  completedTasksCount: number;
  totalTasksCount: number;
  streak: number;
}

interface DayMessage {
  title: string;
  subtitle: string;
}

const EXCELLENT_MESSAGES: DayMessage[] = [
  {
    title: "Absolutely crushing it!",
    subtitle: "You're building unstoppable momentum",
  },
  {
    title: "Outstanding performance!",
    subtitle: "This is what champions look like",
  },
  {
    title: "Incredible work today!",
    subtitle: "You're making progress look easy",
  },
  {
    title: "Phenomenal execution!",
    subtitle: "Your future self will thank you",
  },
  {
    title: "You're on fire!",
    subtitle: "Keep this energy going strong",
  },
];

const GOOD_MESSAGES: DayMessage[] = [
  {
    title: "Solid work today!",
    subtitle: "Consistency builds excellence",
  },
  {
    title: "Great progress!",
    subtitle: "Every step forward counts",
  },
  {
    title: "Well done today!",
    subtitle: "You showed up and delivered",
  },
  {
    title: "Strong effort!",
    subtitle: "You're building the right habits",
  },
  {
    title: "Nice momentum!",
    subtitle: "Keep stacking these wins",
  },
];

const OKAY_MESSAGES: DayMessage[] = [
  {
    title: "Progress is progress",
    subtitle: "Tomorrow is another opportunity",
  },
  {
    title: "You showed up today",
    subtitle: "That's what matters most",
  },
  {
    title: "Keep pushing forward",
    subtitle: "Better days are coming",
  },
  {
    title: "Steady wins the race",
    subtitle: "Focus on the next task",
  },
  {
    title: "One step at a time",
    subtitle: "You're still moving forward",
  },
];

const TOUGH_MESSAGES: DayMessage[] = [
  {
    title: "Tomorrow is a fresh start",
    subtitle: "Champions bounce back stronger",
  },
  {
    title: "Every setback is a setup",
    subtitle: "Use this as fuel for tomorrow",
  },
  {
    title: "Tough days build character",
    subtitle: "You're stronger than you think",
  },
  {
    title: "Reset and attack tomorrow",
    subtitle: "The comeback starts now",
  },
  {
    title: "This is part of the journey",
    subtitle: "Growth happens in the struggle",
  },
];

export function DaySummary({
  fadeAnim,
  completedTasksCount,
  totalTasksCount,
  streak,
}: DaySummaryProps) {
  const completionRate =
    totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  const message = useMemo(() => {
    let messages: DayMessage[];

    if (completionRate >= 90) {
      messages = EXCELLENT_MESSAGES;
    } else if (completionRate >= 70) {
      messages = GOOD_MESSAGES;
    } else if (completionRate >= 40) {
      messages = OKAY_MESSAGES;
    } else {
      messages = TOUGH_MESSAGES;
    }

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [completionRate]);

  return (
    <Animated.View
      style={[tw`justify-center items-center px-3 pt-6`, { opacity: fadeAnim }]}
    >
      <Text style={tw`text-white font-tussi text-lg mb-1 text-center`}>
        {message.title}
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm mb-8 text-center`}>
        {message.subtitle}
      </Text>

      <View style={tw`items-center mb-6`}>
        <GradientText style={tw`text-white font-tussi text-6xl`}>
          {completedTasksCount}/{totalTasksCount}
        </GradientText>
        <Text style={tw`text-white/60 font-mont text-base mt-2`}>
          tasks completed today
        </Text>
      </View>
    </Animated.View>
  );
}
