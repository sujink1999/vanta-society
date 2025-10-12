import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useTasks } from "@/hooks/useTasks";
import { cadenceToFrequency, constructTaskCommand } from "@/utils/taskHelpers";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GradientText } from "./GradientText";
import { Header } from "./Header";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/Icons";
import { TaskCard } from "./TaskCard";

const today = moment().format("YYYY-MM-DD");

// Category colors mapping
const CATEGORY_COLORS: Record<string, string> = {
  movement: "#ED6E2F",
  recovery: "#3A8DFF",
  growth: "#9AD041",
  fuel: "#8B41D0",
};

export function DailyRoutine() {
  const { user } = useGlobalContext();
  const [currentDay, setCurrentDay] = useState(1);
  const [activeTab, setActiveTab] = useState<"todos" | "done" | "skipped">(
    "todos"
  );

  // Calculate the actual current day based on Winter Arc start date
  const winterArcStartDate = user?.winterArcStartDate;

  // Set current day to actual day on mount
  useEffect(() => {
    if (!user?.winterArcStartDate) return;

    const actualCurrentDay = Math.max(
      1,
      Math.min(66, moment().diff(moment(user.winterArcStartDate), "days") + 1)
    );
    setCurrentDay(actualCurrentDay);
  }, [user]);

  // Calculate the date for the selected day
  const selectedDate = winterArcStartDate
    ? moment(winterArcStartDate)
        .add(currentDay - 1, "days")
        .format("YYYY-MM-DD")
    : today;

  // Check if selected date is today
  const isToday = selectedDate === today;

  const tasks = useTasks(selectedDate, activeTab);
  const { markTaskDone, skipTask, undoTaskAction, error } =
    useTaskActions(selectedDate);

  const handlePrevDay = () => {
    setCurrentDay((prev) => Math.max(1, prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => Math.min(75, prev + 1));
  };

  const handleTaskDone = useCallback(
    async (userRoutineId: number) => {
      return await markTaskDone(userRoutineId);
    },
    [markTaskDone]
  );

  const handleTaskSkip = useCallback(
    async (userRoutineId: number) => {
      return await skipTask(userRoutineId);
    },
    [skipTask]
  );

  const handleTaskUndo = useCallback(
    async (userRoutineId: number) => {
      return await undoTaskAction(userRoutineId);
    },
    [undoTaskAction]
  );

  const tasksWithoutSleep = tasks.filter(
    (task) => task.taskName !== "Consistent wake time"
  );

  return (
    <View style={tw`flex-1 px-3 pt-3 flex-col gap-3 relative`}>
      <Header />

      {/* Day Counter with Navigation */}
      <View
        style={tw`flex-row items-center justify-between px-2 mt-4 mb-2 relative`}
      >
        <View style={tw`flex-col gap-1`}>
          <View style={tw`flex-row items-center gap-2`}>
            <Text>
              <GradientText style={tw`text-white font-tussi text-lg`}>
                DAY
              </GradientText>
              <GradientText style={tw`text-white font-tussi text-3xl pl-2`}>
                {currentDay}
              </GradientText>
              <GradientText style={tw`text-white font-tussi text-lg pl-1`}>
                /66
              </GradientText>
            </Text>
          </View>
          <Text style={tw`text-white/60 font-mont text-xs`}>
            {moment(selectedDate).format("ddd, MMM D")}
          </Text>
        </View>

        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity
            onPress={handlePrevDay}
            disabled={currentDay <= 1}
            style={tw`p-2 ${currentDay <= 1 ? "opacity-30" : ""}`}
          >
            <ChevronLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextDay}
            disabled={currentDay >= 75}
            style={tw`p-2 ${currentDay >= 75 ? "opacity-30" : ""}`}
          >
            <ChevronRightIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={tw`rounded-md flex-row  p-1 gap-2 `}>
        {(["todos", "done", "skipped"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw`py-1 px-6 rounded-sm ${
              activeTab === tab ? "bg-white" : "bg-white/10"
            }`}
          >
            <Text
              style={tw`text-center font-tussi text-xs ${
                activeTab === tab ? "text-black" : "text-textSecondary"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error Message */}
      {error && (
        <View style={tw`bg-red-500/10 rounded-md p-3 mb-2`}>
          <Text style={tw`text-red-500 font-mont-medium text-sm`}>{error}</Text>
        </View>
      )}

      {/* Tasks List */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`gap-2 pb-[90px] pt-4`}
      >
        {tasksWithoutSleep.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center py-20`}>
            <Text style={tw`text-white/60 font-tussi text-sm text-center`}>
              {activeTab === "todos"
                ? "All done for today"
                : activeTab === "done"
                ? "No completed tasks"
                : "No skipped tasks"}
            </Text>
          </View>
        ) : (
          tasksWithoutSleep.map((task) => {
            const taskCommand = constructTaskCommand(
              task.taskText,
              task.taskName,
              task.optionsSet
            );
            const frequency = cadenceToFrequency(task.cadence);
            const categoryColor =
              CATEGORY_COLORS[task.taskCategory] || "#FFFFFF";

            return (
              <TaskCard
                key={task.id}
                task={task}
                categoryColor={categoryColor}
                taskCommand={taskCommand}
                frequency={frequency}
                onDone={() => handleTaskDone(task.id)}
                onSkip={() => handleTaskSkip(task.id)}
                onUndo={() => handleTaskUndo(task.id)}
                activeTab={activeTab}
                isToday={isToday}
                selectedDate={selectedDate}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
