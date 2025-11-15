import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { WorkoutSession } from "@/services/api/types";
import moment from "moment";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AutoHeightView } from "../AutoHeightView";
import { PlatformBlurView } from "../PlatformBlurView";

interface WorkoutCalendarProps {
  workouts: WorkoutSession[];
  onDayPress?: (date: string) => void;
  selectedDate?: string | null;
}

const WORKOUT_COLORS = {
  strength: "#FF5C2A", // primary
  cardio: "#4CAF50",
  flexibility: "#9C27B0",
  sports: "#2196F3",
};

export function WorkoutCalendar({
  workouts,
  onDayPress,
  selectedDate,
}: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(moment());

  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");
  const startOfWeek = startOfMonth.clone().startOf("week");
  const endOfWeek = endOfMonth.clone().endOf("week");

  const goToPrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const handleDatePress = (date: moment.Moment) => {
    if (onDayPress) {
      onDayPress(date.format("YYYY-MM-DD"));
    }
  };

  const getWorkoutsForDate = (date: moment.Moment) => {
    return workouts.filter((w) => moment(w.date).isSame(date, "day"));
  };

  const isCurrentMonth = (date: moment.Moment) => {
    return date.month() === currentDate.month();
  };

  const isToday = (date: moment.Moment) => {
    return date.isSame(moment(), "day");
  };

  // Generate calendar days
  const calendarDays = [];
  const current = startOfWeek.clone();

  while (current.isSameOrBefore(endOfWeek, "day")) {
    calendarDays.push(current.clone());
    current.add(1, "day");
  }

  // Split into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <AutoHeightView>
      <PlatformBlurView
        intensity={50}
        tint="dark"
        style={tw` border border-white/10 rounded-2xl overflow-hidden p-4`}
      >
        {/* Header */}
        <View
          style={tw`flex-row items-center  mb-4 gap-2 opacity-80 bg-black/20 rounded-lg `}
        >
          <TouchableOpacity onPress={goToPrevMonth} style={tw`p-2`}>
            <ChevronLeftIcon size={20} color="white" />
          </TouchableOpacity>

          <Text style={tw`text-white font-tussi text-xs`}>
            {currentDate.format("MMMM YYYY")}
          </Text>

          <TouchableOpacity onPress={goToNextMonth} style={tw`p-2`}>
            <ChevronRightIcon size={20} color="white" />
          </TouchableOpacity>
        </View>
        {/* Weekday headers */}
        <View style={tw`flex-row mb-2`}>
          {weekdays.map((day) => (
            <View key={day} style={tw`flex-1 items-center py-2`}>
              <Text style={tw`text-white/60 font-tussi text-xs`}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={tw`flex-row`}>
            {week.map((date) => {
              const currentMonth = isCurrentMonth(date);
              const today = isToday(date);
              const dayWorkouts = getWorkoutsForDate(date);
              const hasWorkouts = dayWorkouts.length > 0;
              const isSelected =
                selectedDate && date.format("YYYY-MM-DD") === selectedDate;

              return (
                <TouchableOpacity
                  key={date.format("YYYY-MM-DD")}
                  onPress={() => handleDatePress(date)}
                  style={tw`flex-1 items-center py-2`}
                >
                  <View
                    style={[
                      tw`w-8 h-8 items-center justify-center pb-2 `,
                      isSelected && tw`bg-white/10 rounded-md`,
                    ]}
                  >
                    <Text
                      style={[
                        tw`font-tussi text-xs`,
                        currentMonth ? tw`text-white` : tw`text-white/20`,
                        today && tw`text-primary`,
                      ]}
                    >
                      {date.format("D")}
                    </Text>
                  </View>

                  {/* Workout Indicators */}
                  {hasWorkouts && (
                    <View style={tw`flex-row gap-0.5 -mt-2`}>
                      {dayWorkouts.slice(0, 3).map((workout, idx) => (
                        <View
                          key={idx}
                          style={[
                            tw`w-1 h-1 rounded-full`,
                            { backgroundColor: WORKOUT_COLORS[workout.type] },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </PlatformBlurView>
    </AutoHeightView>
  );
}
