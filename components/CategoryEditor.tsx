import tw from "@/constants/tw";
import { Task, UserRoutine } from "@/services/api/types";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "./Button";
import { CategoryTasks } from "./CategoryTasks";
import { ChevronLeftIcon } from "./icons/Icons";
import { TaskSelectionCard } from "./TaskSelectionCard";

interface CategoryEditorProps {
  category: string;
  categoryColor: string;
  initialTasks: UserRoutine[];
  allTasksForCategory: Task[];
  onSave: (updatedTasks: UserRoutine[]) => void;
  onCancel: () => void;
}

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

export function CategoryEditor({
  category,
  categoryColor,
  initialTasks,
  allTasksForCategory,
  onSave,
  onCancel,
}: CategoryEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with mandatory tasks included
  const [selectedTasks, setSelectedTasks] = useState<UserRoutine[]>(() => {
    const tasks = [...initialTasks];

    // Add any mandatory tasks that aren't already in initialTasks
    allTasksForCategory.forEach((task) => {
      if (task.isMandatory && !tasks.some((t) => t.taskId === task.id)) {
        const mandatoryTask: UserRoutine = {
          id: Date.now() + Math.random(), // Temporary ID
          taskId: task.id,
          taskName: task.name,
          taskText: task.text,
          taskCategory: task.category,
          taskOptions: task.options,
          optionsSet: task.options.map((opt) => ({
            name: opt.name,
            type: opt.type.toLowerCase(), // Ensure consistent casing
            value: opt.default,
          })),
          cadence: [1, 1, 1, 1, 1, 1, 1],
          isActive: true,
          createdAt: new Date().toISOString(),
          isMandatory: task.isMandatory,
          canCustomizeCadence: task.canCustomizeCadence,
          disciplineImpact: task.disciplineImpact || 0,
          mindsetImpact: task.mindsetImpact || 0,
          strengthImpact: task.strengthImpact || 0,
          momentumImpact: task.momentumImpact || 0,
          confidenceImpact: task.confidenceImpact || 0,
        };
        tasks.push(mandatoryTask);
      }
    });

    return tasks;
  });

  const categoryDisplayName = getCategoryDisplayName(category);

  // Memoize hasChanges calculation
  const hasChanges = useMemo(() => {
    if (selectedTasks.length !== initialTasks.length) return true;

    return selectedTasks.some((selectedTask) => {
      const initialTask = initialTasks.find(
        (t) => t.taskId === selectedTask.taskId
      );
      if (!initialTask) return true;

      // Compare cadence
      if (
        JSON.stringify(selectedTask.cadence) !==
        JSON.stringify(initialTask.cadence)
      ) {
        return true;
      }

      // Compare options
      if (
        JSON.stringify(selectedTask.optionsSet) !==
        JSON.stringify(initialTask.optionsSet)
      ) {
        return true;
      }

      return false;
    });
  }, [selectedTasks, initialTasks]);

  const handleSave = useCallback(async () => {
    if (hasChanges) {
      setIsLoading(true);
      try {
        await onSave(selectedTasks);
      } finally {
        setIsLoading(false);
      }
    } else {
      onCancel(); // No changes, just go back
    }
  }, [hasChanges, selectedTasks, onSave, onCancel]);

  console.log(selectedTasks);

  return (
    <KeyboardAvoidingView
      style={tw`flex-1 flex-col pb-6`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={tw`flex-row items-center mb-2 px-3`}>
        <TouchableOpacity onPress={onCancel} style={tw`mr-4 p-2`}>
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>

        <View style={tw`flex-1 justify-center items-center`}>
          <Text
            style={[tw`text-xl font-tussi-bold mb-1`, { color: categoryColor }]}
          >
            {categoryDisplayName}
          </Text>
          <Text style={tw`text-textSecondary font-mont text-sm`}>
            Customize your {categoryDisplayName.toLowerCase()} routine
          </Text>
        </View>
        <View style={tw`w-10`} />
      </View>

      {/* Current Tasks Card */}
      {selectedTasks.length > 0 && (
        <View style={tw`mt-3 mb-3 px-2`}>
          <CategoryTasks
            category={category}
            tasks={selectedTasks}
            categoryColor={categoryColor}
          />
        </View>
      )}
      <View style={tw`flex-row items-center gap-3 my-6`}>
        <Text style={tw`text-textSecondary font-tussi text-sm`}>routines</Text>
        <View style={tw`flex-1 h-[1px] bg-textSecondary`} />
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-3`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tasks to Add Section */}
        <View style={tw`flex-col gap-3 pb-3`}>
          {allTasksForCategory.map((task) => {
            const selectedTask = selectedTasks.find(
              (st) => st.taskId === task.id
            );
            const isSelected = !!selectedTask;

            return (
              <TaskSelectionCard
                key={`task-${task.id}`}
                task={task}
                isSelected={isSelected}
                selectedTask={selectedTask}
                categoryColor={categoryColor}
                onToggle={(taskId) => {
                  // Don't allow toggling off mandatory tasks
                  if (isSelected && task.isMandatory) {
                    return;
                  }

                  if (isSelected) {
                    // Remove task
                    setSelectedTasks((prev) =>
                      prev.filter((t) => t.taskId !== taskId)
                    );
                  } else {
                    // Add task with default values from task.options
                    const newTask: UserRoutine = {
                      id: Date.now(), // Temporary ID
                      taskId: taskId,
                      taskName: task.name,
                      taskText: task.text,
                      taskCategory: task.category,
                      taskOptions: task.options,
                      optionsSet: task.options.map((opt) => ({
                        name: opt.name,
                        type: opt.type.toLowerCase(), // Ensure consistent casing
                        value: opt.default, // Use the default value from task options
                      })),
                      cadence: [1, 1, 1, 1, 1, 0, 0], // Default weekdays
                      isActive: true,
                      createdAt: new Date().toISOString(),
                      isMandatory: task.isMandatory,
                      canCustomizeCadence: task.canCustomizeCadence,
                      disciplineImpact: task.disciplineImpact || 0,
                      mindsetImpact: task.mindsetImpact || 0,
                      strengthImpact: task.strengthImpact || 0,
                      momentumImpact: task.momentumImpact || 0,
                      confidenceImpact: task.confidenceImpact || 0,
                    };
                    setSelectedTasks((prev) => [...prev, newTask]);
                  }
                }}
                onUpdate={(updatedTask) => {
                  setSelectedTasks((prev) =>
                    prev.map((t) =>
                      t.taskId === updatedTask.taskId ? updatedTask : t
                    )
                  );
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={tw`px-3 mt-3`}>
        {hasChanges && (
          <Button
            title="UPDATE"
            onPress={handleSave}
            disabled={!hasChanges || selectedTasks.length === 0}
            loading={isLoading}
            style={{ backgroundColor: categoryColor }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
