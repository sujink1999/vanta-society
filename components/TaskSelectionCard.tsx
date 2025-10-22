import tw from "@/constants/tw";
import { Task, UserRoutine } from "@/services/api/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CadenceSelector } from "./CadenceSelector";
import { getTaskIcon } from "./icons/TaskIcons";
import { OptionSelector } from "./OptionSelector";

interface TaskSelectionCardProps {
  task: Task;
  isSelected: boolean;
  selectedTask?: UserRoutine;
  categoryColor: string;
  onToggle: (taskId: number) => void;
  onUpdate: (updatedTask: UserRoutine) => void;
}

export function TaskSelectionCard({
  task,
  isSelected,
  selectedTask,
  categoryColor,
  onToggle,
  onUpdate,
}: TaskSelectionCardProps) {
  const IconComponent = getTaskIcon(task.name);

  const handleCadenceChange = (newCadence: number[]) => {
    if (selectedTask && onUpdate) {
      onUpdate({
        ...selectedTask,
        cadence: newCadence,
      });
    }
  };

  const handleOptionChange = (optionName: string, newValue: any) => {
    if (selectedTask && onUpdate) {
      const updatedOptionsSet = selectedTask.optionsSet.map((opt) =>
        opt.name === optionName ? { ...opt, value: newValue } : opt
      );

      onUpdate({
        ...selectedTask,
        optionsSet: updatedOptionsSet,
      });
    }
  };

  const renderExpandedContent = () => {
    if (!isSelected || !selectedTask) return <></>;

    return (
      <View>
        {/* Cadence Selector */}
        {task.canCustomizeCadence && (
          <View style={tw`mt-6`}>
            <CadenceSelector
              cadence={selectedTask.cadence}
              onChange={handleCadenceChange}
              accentColor={categoryColor}
            />
          </View>
        )}

        {/* Options Selector */}
        {task.options.length > 0 && (
          <View style={tw`flex-col gap-4 mt-6`}>
            {task.options.map((option) => {
              const currentValue = selectedTask.optionsSet.find(
                (opt) => opt.name === option.name
              )?.value;

              return (
                <OptionSelector
                  key={option.name}
                  option={option}
                  currentValue={currentValue}
                  onChange={(newValue) =>
                    handleOptionChange(option.name, newValue)
                  }
                  accentColor={categoryColor}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <LinearGradient
        colors={
          isSelected
            ? [`${categoryColor}20`, `${categoryColor}05`]
            : ["#FFFFFF10", "#FFFFFF10"]
        }
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={tw`border border-white/5 rounded-sm p-3 flex-row items-center justify-between`}
      >
        <View style={tw`flex-row flex-1`}>
          {/* Radio button visual */}
          <TouchableOpacity
            onPress={() => onToggle(task.id)}
            disabled={task.isMandatory}
            style={[
              tw`w-4 h-4 rounded-full border mr-3 mt-1 justify-center items-center`,
              {
                borderColor: isSelected
                  ? task.isMandatory
                    ? "#FFFFFF90"
                    : categoryColor
                  : "#666",
              },
            ]}
          >
            {isSelected && (
              <View
                style={[
                  tw`w-2 h-2 rounded-full self-center`,
                  {
                    backgroundColor: task.isMandatory
                      ? "#FFFFFF90"
                      : categoryColor,
                  },
                ]}
              />
            )}
          </TouchableOpacity>

          <View style={tw`flex-1 flex-col ml-2`}>
            <View style={tw`flex-row items-center `}>
              <View style={tw`flex-col gap-1 flex-1`}>
                <TouchableOpacity
                  onPress={() => onToggle(task.id)}
                  disabled={task.isMandatory}
                >
                  <Text
                    style={tw`text-white font-mont-medium text-sm`}
                    numberOfLines={2}
                  >
                    {task.name}
                  </Text>
                </TouchableOpacity>
                {task.isMandatory && (
                  <Text style={tw`font-mont text-xs text-textSecondary`}>
                    Required
                  </Text>
                )}
              </View>

              {IconComponent && (
                <View style={tw`ml-3`}>
                  <IconComponent
                    size={20}
                    color={isSelected ? categoryColor : "#666"}
                  />
                </View>
              )}
            </View>

            {renderExpandedContent()}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
