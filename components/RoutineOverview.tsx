import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { UserRoutine } from "@/services/api/types";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "./Button";
import { CategoryTasks } from "./CategoryTasks";
import { ChevronLeftIcon } from "./icons/Icons";

interface RoutineOverviewProps {
  onCategoryEdit: (
    category: string,
    tasks: UserRoutine[],
    categoryColor: string
  ) => void;
  onSubmit: () => void;
  showBackButton?: boolean;
}

// Category colors mapping
const CATEGORY_COLORS: Record<string, string> = {
  movement: "#ED6E2F",
  recovery: "#3A8DFF",
  growth: "#8B41D0",
  fuel: "#9AD041",
};

// Category order
const CATEGORY_ORDER = ["movement", "recovery", "growth", "fuel"];

export function RoutineOverview({
  onCategoryEdit,
  onSubmit,
  showBackButton,
}: RoutineOverviewProps) {
  const router = useRouter();
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
    <View style={tw`w-full flex-1 px-2  `}>
      <View style={tw`flex-row items-center gap-6 mb-4 mt-3 `}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`  p-2 bg-white/5 self-start border border-white/5 rounded-md`}
          >
            <ChevronLeftIcon size={20} color="white" />
          </TouchableOpacity>
        )}
        <Text
          style={tw`text-white font-tussi-bold text-base text-center flex-1 `}
        >
          Your <Text style={tw` text-primary`}>PROJECT66</Text> routine
        </Text>
        {showBackButton && <View style={tw`w-7 h-7`} />}
      </View>

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
      {!showBackButton && (
        <View style={tw`pb-6`}>
          <Button title="Lock In" onPress={onSubmit} />
        </View>
      )}
    </View>
  );
}
