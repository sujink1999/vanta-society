import { useGlobalContext } from "@/contexts/GlobalContext";
import { getTasks } from "@/services/api/routines";
import { Task, UserRoutine } from "@/services/api/types";
import React, { useEffect, useState } from "react";
import { CategoryEditor } from "./CategoryEditor";
import { RoutineOverview } from "./RoutineOverview";

interface RoutineEditorProps {
  onSubmit: () => void;
}

export function RoutineEditor({ onSubmit }: RoutineEditorProps) {
  const { refetchUserSilently } = useGlobalContext();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [editingCategory, setEditingCategory] = useState<{
    category: string;
    tasks: UserRoutine[];
    categoryColor: string;
  } | null>(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await getTasks();
        if (response.success) {
          setAllTasks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchAllTasks();
  }, []);

  const handleCategoryEdit = (
    category: string,
    tasks: UserRoutine[],
    categoryColor: string
  ) => {
    setEditingCategory({ category, tasks, categoryColor });
  };

  const handleSaveCategory = async (updatedTasks: UserRoutine[]) => {
    if (!editingCategory) return;

    try {
      // Transform UserRoutine to RoutineTaskRequest format
      const tasks = updatedTasks.map((task) => ({
        taskId: task.taskId,
        optionsSet: task.optionsSet,
        cadence: task.cadence,
      }));

      console.log("tasks", tasks);

      // const response = await setCategoryRoutine({
      //   category: editingCategory.category,
      //   tasks: tasks,
      // });

      // if (response.success) {
      //   // Refetch user data to update routine
      //   await refetchUserSilently();
      //   setEditingCategory(null);
      // }
    } catch (error) {
      console.error("Failed to save category routine:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    onSubmit();
  };

  // Show editing screen if category is being edited
  if (editingCategory) {
    const tasksForCategory = allTasks.filter(
      (task) => task.category === editingCategory.category
    );

    return (
      <CategoryEditor
        category={editingCategory.category}
        categoryColor={editingCategory.categoryColor}
        initialTasks={editingCategory.tasks}
        allTasksForCategory={tasksForCategory}
        onSave={handleSaveCategory}
        onCancel={handleCancelEdit}
      />
    );
  }

  // Show overview screen
  return (
    <RoutineOverview
      onCategoryEdit={handleCategoryEdit}
      onSubmit={handleSubmit}
    />
  );
}
