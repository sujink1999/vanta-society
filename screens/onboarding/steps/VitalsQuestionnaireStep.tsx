import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { QuestionCard } from "@/components/QuestionCard";
import { StoryProgressBar } from "@/components/StoryProgressBar";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { QuestionnaireQuestion } from "@/services/api/types";
import { submitQuestionnaire } from "@/services/api/users";
import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

interface VitalsQuestionnaireStepProps {
  questions: QuestionnaireQuestion[];
  onNext: () => void;
}

const VITALS_ORDER = [
  "discipline",
  "mindset",
  "strength",
  "momentum",
  "confidence",
];

export function VitalsQuestionnaireStep({
  questions,
  onNext,
}: VitalsQuestionnaireStepProps) {
  const { refetchUserSilently } = useGlobalContext();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentVitalIndex, setCurrentVitalIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentVital = VITALS_ORDER[currentVitalIndex];

  // Scroll to top when question changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentVitalIndex]);
  const vitalQuestions = questions.filter((q) => {
    return q.type === currentVital;
  });

  const handleAnswerSelect = (questionKey: string, value: any) => {
    const newResponses = {
      ...responses,
      [questionKey]: value,
    };
    setResponses(newResponses);
  };

  const handleNextVital = () => {
    // Check if all questions for current vital are answered
    const unansweredQuestions = vitalQuestions.some((q) => {
      const response = responses[q.key];
      // Handle different response types
      if (response === undefined || response === null) return true;
      if (q.questionType === "multi_select" && Array.isArray(response)) {
        return response.length === 0;
      }
      return false;
    });

    if (unansweredQuestions) {
      Alert.alert(
        "Please answer all questions",
        "Complete all questions for this vital before continuing."
      );
      return;
    }

    if (currentVitalIndex < VITALS_ORDER.length - 1) {
      // Move to next vital
      setCurrentVitalIndex(currentVitalIndex + 1);
    } else {
      // All done, submit responses
      submitResponses(responses);
    }
  };

  const submitResponses = async (finalResponses: Record<string, number>) => {
    setIsLoading(true);
    try {
      const response = await submitQuestionnaire({
        responses: finalResponses,
      });

      if (response.success) {
        onNext();
        await refetchUserSilently();
      } else {
        Alert.alert("Error", "Failed to save responses. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to save responses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (vitalQuestions.length === 0) {
    return (
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <Text style={tw`text-white font-tussi text-lg`}>
          Loading questions...
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 `}>
        <View
          style={tw`absolute inset-0 bg-black/80 items-center justify-center`}
        >
          <Text style={tw`text-white font-tussi text-sm mb-4`}>
            Processing your responses...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 px-3 pb-8 pt-8 `}>
      {/* Progress */}
      <View style={tw`flex flex-col gap-8 mb-4`}>
        <StoryProgressBar
          totalSteps={VITALS_ORDER.length}
          currentStep={currentVitalIndex}
        />
        <View style={tw`flex-row justify-center items-center mb-2 `}>
          <GradientText
            style={tw`text-textPrimary text-center font-tussi-bold text-6`}
          >
            {currentVital?.toUpperCase()}
          </GradientText>
        </View>
      </View>

      {/* All Questions for Current Vital */}
      <ScrollView
        ref={scrollViewRef}
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`mb-8`}>
          {vitalQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedValue={responses[question.key]}
              onAnswerSelect={(value) =>
                handleAnswerSelect(question.key, value)
              }
              isLast={index === vitalQuestions.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      {(() => {
        const allQuestionsAnswered = vitalQuestions.every((q) => {
          const response = responses[q.key];
          // Handle different response types for validation
          if (response === undefined || response === null) return false;
          if (q.questionType === "multi_select" && Array.isArray(response)) {
            return response.length > 0;
          }
          return true;
        });
        return allQuestionsAnswered ? (
          <View style={tw`pt-1`}>
            <Button
              title={
                currentVitalIndex === VITALS_ORDER.length - 1
                  ? "Continue"
                  : "Next"
              }
              onPress={handleNextVital}
              loading={isLoading}
            />
          </View>
        ) : null;
      })()}
    </View>
  );
}
