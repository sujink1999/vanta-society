import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { UserRoutine } from "@/services/api/types";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "./Button";
import { CategoryTasks } from "./CategoryTasks";

interface RoutineOverviewProps {
  onCategoryEdit: (
    category: string,
    tasks: UserRoutine[],
    categoryColor: string
  ) => void;
  onSubmit: () => void;
}

// Category colors mapping
const CATEGORY_COLORS: Record<string, string> = {
  movement: "#ED6E2F",
  recovery: "#3A8DFF",
  growth: "#9AD041",
  fuel: "#8B41D0",
};

// Category order
const CATEGORY_ORDER = ["movement", "recovery", "growth", "fuel"];

export function RoutineOverview({
  onCategoryEdit,
  onSubmit,
}: RoutineOverviewProps) {
  const { routine } = useGlobalContext();

  // Group routine tasks by category
  const groupedTasks = React.useMemo(() => {
    if (!routine || routine.length === 0) {
      return {};
    }

    return routine.reduce((groups: Record<string, UserRoutine[]>, task) => {
      const category = task.taskCategory;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
      return groups;
    }, {});
  }, [routine]);

  // Handle empty routine state
  if (!routine || routine.length === 0) {
    return (
      <View style={tw`bg-white/5 border border-white/10 rounded-lg p-6 w-full`}>
        <Text style={tw`text-white font-mont-medium text-lg text-center mb-4`}>
          Your Routine
        </Text>
        <Text style={tw`text-textSecondary font-mont text-sm text-center`}>
          No routine found. Complete the onboarding to generate your
          personalized routine.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`w-full flex-1 px-2 `}>
      <Text style={tw`text-white font-tussi-bold text-base mb-4 text-center`}>
        Your <Text style={tw` text-primary`}>WINTER ARC</Text> routine
      </Text>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {CATEGORY_ORDER.map((category) => {
          const tasks = groupedTasks[category];
          const categoryColor = CATEGORY_COLORS[category] || "#FFFFFF";

          // Show category even if no tasks (for editing)
          return (
            <CategoryTasks
              key={category}
              category={category}
              tasks={tasks || []}
              categoryColor={categoryColor}
              onEdit={() =>
                onCategoryEdit(category, tasks || [], categoryColor)
              }
            />
          );
        })}
      </ScrollView>
      <View style={tw`pb-3 `}>
        <Button title="Lock In" onPress={onSubmit} />
      </View>
    </View>
  );
}
