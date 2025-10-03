import { getQuestions } from "@/services/api/questionnaire";
import { QuestionnaireQuestion } from "@/services/api/types";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { VitalsIntroStep } from "./VitalsIntroStep";
import { VitalsQuestionnaireStep } from "./VitalsQuestionnaireStep";

interface RecordVitalsStepProps {
  onNext: () => void;
}

export function RecordVitalsStep({ onNext }: RecordVitalsStepProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const questionsData = await getQuestions();
      console.log("Loaded questions:", questionsData);
      setQuestions(questionsData.data || []);
    } catch (error) {
      console.log("Error loading questions:", error);
      Alert.alert("Error", "Failed to load questions. Please try again.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleStartVitals = () => {
    if (questions.length === 0) {
      Alert.alert("Error", "Questions not loaded yet. Please wait.");
      return;
    }
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <VitalsIntroStep
        onNext={handleStartVitals}
        loading={isLoadingQuestions}
      />
    );
  }

  return <VitalsQuestionnaireStep questions={questions} onNext={onNext} />;
}
