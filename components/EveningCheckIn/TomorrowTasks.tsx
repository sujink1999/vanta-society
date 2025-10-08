import tw from "@/constants/tw";
import { TaskForDate } from "@/hooks/useTasks";
import { constructTaskCommand } from "@/utils/taskHelpers";
import React from "react";
import { Animated, Text, View } from "react-native";

interface TomorrowTasksProps {
  fadeAnim: Animated.Value;
  tasks: TaskForDate[];
}

export function TomorrowTasks({ fadeAnim, tasks }: TomorrowTasksProps) {
  return (
    <Animated.View style={[tw`px-3 pt-3`, { opacity: fadeAnim }]}>
      <Text style={tw`text-white font-tussi text-base mb-2`}>
        Review Tomorrow&apos;s Tasks
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm mb-6`}>
        {tasks.length} {tasks.length === 1 ? "task" : "tasks"} scheduled
      </Text>

      <View style={tw`gap-2 pb-6`}>
        {tasks.length === 0 ? (
          <View style={tw`justify-center items-center py-20`}>
            <Text style={tw`text-white/60 font-mont text-sm`}>
              No tasks scheduled for tomorrow
            </Text>
          </View>
        ) : (
          tasks.map((task, index) => {
            const taskCommand = constructTaskCommand(
              task.taskText,
              task.taskName,
              task.optionsSet
            );

            return (
              <View key={task.id} style={tw`flex-row items-center gap-2`}>
                <Text style={tw`text-white/40 font-mont text-xs`}>
                  {index + 1}.
                </Text>
                <Text
                  style={tw`text-white font-mont text-sm flex-1`}
                  numberOfLines={1}
                >
                  {taskCommand}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </Animated.View>
  );
}
