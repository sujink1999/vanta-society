import tw from "@/constants/tw";
import { UserRoutine } from "@/services/api/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CycleIcon, PlusIcon } from "./icons/Icons";
import { getTaskIcon } from "./icons/TaskIcons";

interface CategoryTasksProps {
  category: string;
  tasks: UserRoutine[];
  categoryColor: string;
  onEdit?: () => void;
}

// Helper function to convert cadence array to frequency text
const cadenceToFrequency = (cadence: number[]): string => {
  const totalDays = cadence.reduce((sum, day) => sum + day, 0);

  if (totalDays === 7) {
    return "Daily";
  } else if (
    totalDays === 5 &&
    cadence[0] === 1 &&
    cadence[1] === 1 &&
    cadence[2] === 1 &&
    cadence[3] === 1 &&
    cadence[4] === 1
  ) {
    return "Weekdays";
  } else {
    return `${totalDays}x weekly`;
  }
};

// Helper function to construct task command from taskText and optionsSet
const constructTaskCommand = (
  taskText: string,
  taskName: string,
  optionsSet: any[]
): string => {
  if (!optionsSet || optionsSet.length === 0) {
    return taskName; // Fallback to task name if no options
  }

  let command = taskText;
  const values = optionsSet.map((option) => option.value).filter(Boolean);

  if (values.length > 0) {
    // Handle different construction patterns based on option types
    const formattedValues = optionsSet
      .map((option, index) => {
        let preposition = "";

        const formattedOptionType = option?.type?.toLowerCase();

        if (formattedOptionType?.includes("duration")) {
          preposition = "for";
        } else if (formattedOptionType === "time_of_day") {
          preposition = "at";
        } else if (formattedOptionType === "text") {
          preposition = "-";
        }

        if (preposition && option.value) {
          return `${preposition} ${option.value}`;
        } else if (option.value) {
          return option.value;
        }
        return "";
      })
      .filter(Boolean);

    command = `${taskText} ${formattedValues.join(" ")}`;
  }

  return command;
};

// Helper function to get category display name
const getCategoryDisplayName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    movement: "MOVE",
    recovery: "RECOVER",
    growth: "GROW",
    fuel: "FUEL",
  };

  return categoryNames[category.toLowerCase()] || category;
};

export function CategoryTasks({
  category,
  tasks,
  categoryColor,
  onEdit,
}: CategoryTasksProps) {
  const categoryDisplayName = getCategoryDisplayName(category);

  if (!onEdit) {
    return (
      <View>
        {/* <LinearGradient
          colors={[`#FFFFFF10`, `${categoryColor}30`]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={tw`border border-white/5  p-3`}
        > */}
        {/* Category Header */}

        {/* Task List */}
        <View style={tw`flex-row flex-wrap gap-2 justify-center `}>
          {tasks.map((task) => {
            const taskCommand = constructTaskCommand(
              task.taskText,
              task.taskName,
              task.optionsSet
            );
            const IconComponent = getTaskIcon(task.taskName);

            return (
              <View key={task.id}>
                <View style={tw`flex-row`}>
                  <View
                    style={[
                      tw` px-2 py-1 rounded-sm rounded-md flex-row items-center bg-white/10  `,
                    ]}
                  >
                    {IconComponent && (
                      <View style={tw`mr-1`}>
                        <IconComponent size={10} color={`#FFFFFF70`} />
                      </View>
                    )}
                    <Text
                      style={[tw`text-white/70 font-mont-medium text-xs `]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {taskCommand}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        {/* </LinearGradient> */}
      </View>
    );
  }

  return (
    <View style={tw`mb-3`}>
      <LinearGradient
        colors={[`#FFFFFF10`, `${categoryColor}30`]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={tw`border border-white/5  p-2`}
      >
        {/* Category Header */}

        <View style={tw`flex-row items-center mb-3 justify-end`}>
          <Text
            style={[
              tw`text-white font-mont-medium text-sm font-tussi `,
              { color: categoryColor },
            ]}
          >
            {categoryDisplayName}
          </Text>
        </View>

        {/* Task List */}
        <View style={tw`flex-col gap-5 px-3 mb-2`}>
          {tasks.map((task) => {
            const taskCommand = constructTaskCommand(
              task.taskText,
              task.taskName,
              task.optionsSet
            );
            const frequency = cadenceToFrequency(task.cadence);
            const IconComponent = getTaskIcon(task.taskName);

            return (
              <View key={task.id}>
                <View style={tw`flex-row`}>
                  {IconComponent && (
                    <View style={tw`mr-4`}>
                      <IconComponent size={20} color={categoryColor} />
                    </View>
                  )}
                  <View style={tw`flex-1 flex-col gap-2`}>
                    <Text
                      style={tw`text-white font-mont-medium text-sm`}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {taskCommand}
                    </Text>

                    <View style={tw`flex-row items-center`}>
                      <CycleIcon size={14} color="#979797" />
                      <Text
                        style={tw`text-textSecondary font-mont-medium text-xs ml-2`}
                        numberOfLines={1}
                      >
                        {frequency}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={tw`self-end py-2 px-4 bg-black rounded-md flex-row items-center`}
          onPress={onEdit}
        >
          <View style={tw`border border-white rounded-full p-[2px]`}>
            <PlusIcon size={8} color="white" />
          </View>
          <Text style={tw`text-white font-tussi text-[11px] ml-2`}>
            Add or Edit
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
