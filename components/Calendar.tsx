import tw from "@/constants/tw";
import moment from "moment";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/Icons";

interface CalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  minDate?: string; // First valid date (YYYY-MM-DD format)
  colorCodedRange?: {
    startDate: string;
    numberOfDays: number;
    color: string;
  }; // Continuous range of dates with color
}

export function Calendar({
  onDateSelect,
  selectedDate,
  minDate,
  colorCodedRange,
}: CalendarProps) {
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
    // Check if date is valid (not before minDate)
    if (minDate && date.isBefore(moment(minDate), "day")) {
      return; // Don't allow selection of invalid dates
    }

    if (onDateSelect) {
      onDateSelect(date.format("YYYY-MM-DD"));
    }
  };

  const isSelected = (date: moment.Moment) => {
    return selectedDate === date.format("YYYY-MM-DD");
  };

  const isCurrentMonth = (date: moment.Moment) => {
    return date.month() === currentDate.month();
  };

  const isToday = (date: moment.Moment) => {
    return date.isSame(moment(), "day");
  };

  const isPastDate = (date: moment.Moment) => {
    // Use minDate if provided, otherwise use current date
    const referenceDate = minDate ? moment(minDate) : moment();
    return date.isBefore(referenceDate, "day");
  };

  const isInColorCodedRange = (date: moment.Moment) => {
    if (!colorCodedRange) return null;

    const startDate = moment(colorCodedRange.startDate);
    const endDate = startDate
      .clone()
      .add(colorCodedRange.numberOfDays - 1, "days");

    if (date.isBetween(startDate, endDate, "day", "[]")) {
      return {
        color: colorCodedRange.color,
        isFirst: date.isSame(startDate, "day"),
        isLast: date.isSame(endDate, "day"),
        position: date.diff(startDate, "days"),
      };
    }

    return null;
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
    <View style={tw`bg-white/5 rounded-lg p-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <TouchableOpacity onPress={goToPrevMonth} style={tw`p-2`}>
          <ChevronLeftIcon size={20} color="white" />
        </TouchableOpacity>

        <Text style={tw`text-white font-tussi text-base`}>
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
          {week.map((date, dayIndex) => {
            const selected = isSelected(date);
            const currentMonth = isCurrentMonth(date);
            const today = isToday(date);
            const pastDate = isPastDate(date);
            const rangeInfo = isInColorCodedRange(date);

            // Get adjacent dates to determine connected styling
            const prevDate = week[dayIndex - 1];
            const nextDate = week[dayIndex + 1];
            const isPrevInRange = prevDate
              ? isInColorCodedRange(prevDate)
              : null;
            const isNextInRange = nextDate
              ? isInColorCodedRange(nextDate)
              : null;

            // Determine border radius for connected appearance
            let borderRadius = "";
            if (rangeInfo && !selected) {
              if (rangeInfo.isFirst && rangeInfo.isLast) {
                borderRadius = "rounded-md"; // Single day
              } else if (rangeInfo.isFirst) {
                borderRadius = "rounded-l-md"; // First day of range
              } else if (rangeInfo.isLast) {
                borderRadius = "rounded-r-md"; // Last day of range
              } else {
                borderRadius = ""; // Middle days - no border radius
              }

              // Handle week breaks - if previous/next day is in range but in different week
              if (!isPrevInRange && !rangeInfo.isFirst) {
                borderRadius = "rounded-l-md"; // Start of week continuation
              }
              if (!isNextInRange && !rangeInfo.isLast) {
                borderRadius = "rounded-r-md"; // End of week continuation
              }
            }

            return (
              <TouchableOpacity
                key={date.format("YYYY-MM-DD")}
                onPress={() => handleDatePress(date)}
                style={[
                  tw`flex-1 items-center my-2 ${borderRadius}`,
                  rangeInfo &&
                    !selected && {
                      backgroundColor: `${rangeInfo.color}30`, // 30% opacity
                    },
                ]}
                disabled={pastDate && !selected}
              >
                <View
                  style={[
                    tw`w-8 h-8 items-center justify-center`,
                    selected && tw`bg-primary/50 rounded-md`,
                    today &&
                      !selected &&
                      tw`border border-primary/50 rounded-md`,
                  ]}
                >
                  <Text
                    style={[
                      tw`font-tussi text-xs`,
                      currentMonth
                        ? pastDate
                          ? selected
                            ? tw`text-white`
                            : tw`text-white/40`
                          : selected
                          ? tw`text-white`
                          : rangeInfo
                          ? { color: rangeInfo.color }
                          : tw`text-white`
                        : tw`text-white/20`,
                    ]}
                  >
                    {date.format("D")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
