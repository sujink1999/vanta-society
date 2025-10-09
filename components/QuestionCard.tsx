import tw from "@/constants/tw";
import { QuestionnaireQuestion } from "@/services/api/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CustomSlider } from "./CustomSlider";

interface QuestionCardProps {
  question: QuestionnaireQuestion;
  selectedValue?: any; // Can be number, string, or array
  onAnswerSelect: (value: any) => void;
  isLast?: boolean;
}

export function QuestionCard({
  question,
  selectedValue,
  onAnswerSelect,
  isLast = false,
}: QuestionCardProps) {
  const renderInput = () => {
    switch (question.questionType) {
      case "slider":
        const min = question.min || 1;
        const max = question.max || 10;
        const step = question.step || 1;
        const currentValue = selectedValue || min;

        return (
          <CustomSlider
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onValueChange={onAnswerSelect}
          />
        );

      case "multi_select":
        const selectedArray = Array.isArray(selectedValue) ? selectedValue : [];

        return (
          <View style={tw`gap-2 flex-row flex-wrap justify-center`}>
            {question.options?.map((option) => {
              const isSelected = selectedArray.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    tw`border px-6 py-1 rounded-md`,
                    isSelected ? tw`bg-white` : tw` bg-white/20`,
                  ]}
                  onPress={() => {
                    let newSelection;
                    if (isSelected) {
                      // Remove from selection
                      newSelection = selectedArray.filter(
                        (val) => val !== option.value
                      );
                    } else {
                      // Add to selection
                      newSelection = [...selectedArray, option.value];
                    }
                    onAnswerSelect(newSelection);
                  }}
                >
                  <Text
                    style={tw`font-tussi text-xs text-center ${
                      isSelected ? "text-black" : "text-white"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case "yes_no":
        const yesNoOptions = [
          { value: true, label: "Yes" },
          { value: false, label: "No" },
        ];

        return (
          <View style={tw`flex-row gap-4 justify-center`}>
            {yesNoOptions.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <TouchableOpacity
                  key={String(option.value)}
                  style={[
                    tw`border px-8 py-3 rounded-md flex-1`,
                    isSelected ? tw`bg-primary/80` : tw`bg-white/20`,
                  ]}
                  onPress={() => onAnswerSelect(option.value)}
                >
                  <Text
                    style={tw`font-tussi text-xs text-center ${
                      isSelected ? "text-black" : "text-white"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case "multiple_choice":
      default:
        // Default multiple choice rendering
        return (
          <View style={tw`gap-2 flex-row flex-wrap justify-center`}>
            {question.options?.map((option) => {
              const isSelected = selectedValue === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    tw`border px-6 py-1 rounded-md`,
                    isSelected ? tw`bg-white  ` : tw` bg-white/20`,
                  ]}
                  onPress={() => onAnswerSelect(option.value)}
                >
                  <Text
                    style={tw`font-tussi text-xs text-center ${
                      isSelected ? "text-black" : "text-white"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
    }
  };

  return (
    <View style={tw`gap-5 py-8 ${!isLast ? "border-b border-white/10" : ""}`}>
      <Text style={tw`text-white font-mont text-base text-center leading-6`}>
        {question.question}
      </Text>
      {renderInput()}
    </View>
  );
}
