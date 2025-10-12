import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTasks } from "@/hooks/useTasks";
import { appActivityStorageManager } from "@/services/storage/AppActivityStorageManager";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { AutoHeightView } from "./AutoHeightView";
import { BedtimeReminder } from "./EveningCheckIn/BedtimeReminder";
import { DayReflection } from "./EveningCheckIn/DayReflection";
import { DaySummary } from "./EveningCheckIn/DaySummary";
import { Greeting } from "./EveningCheckIn/Greeting";
import { TomorrowTasks } from "./EveningCheckIn/TomorrowTasks";

interface EveningCheckInProps {
  onComplete: (data: {
    totalTasks: number;
    completedTasks: number;
    completedTaskIds: number[];
    dayMood?: string;
    journal?: string;
    imageRefs?: string[];
  }) => void;
}

const today = moment().format("YYYY-MM-DD");
const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

export function EveningCheckIn({ onComplete }: EveningCheckInProps) {
  const { user, winterArcStats } = useGlobalContext();
  const todayTasks = useTasks(today);
  const tomorrowTasks = useTasks(tomorrow);
  const completedTasks = useTasks(today, "done");

  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  const [imageUris, setImageUris] = useState<string[]>([]);

  useEffect(() => {
    // Fade in animation when step changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    // Validate mood selection before proceeding from reflection step
    if (currentStep === 2 && !selectedMood) {
      return; // Don't proceed without mood
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Move to next step (max is step 4: BedtimeReminder)
      setCurrentStep(currentStep + 1);
    });
  };

  const handleComplete = async () => {
    // Clear all app activity timestamps
    await appActivityStorageManager.clearAllActivities();

    // Complete check-in (called from BedtimeReminder after 5 seconds)
    const completedTaskIds = completedTasks.map((task) => task.id);
    onComplete({
      totalTasks: todayTasks.length,
      completedTasks: completedTasks.length,
      completedTaskIds,
      dayMood: selectedMood || undefined,
      journal: journal.trim() || undefined,
      imageRefs: imageUris.length > 0 ? imageUris : undefined,
    });
  };

  const pickImage = async () => {
    if (imageUris.length >= 5) {
      return; // Max 5 images
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUris([...imageUris, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris(imageUris.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Greeting
            fadeAnim={fadeAnim}
            firstName={user?.firstName || "Champ"}
          />
        );

      case 1:
        return (
          <DaySummary
            fadeAnim={fadeAnim}
            completedTasksCount={completedTasks.length}
            totalTasksCount={todayTasks.length}
            streak={winterArcStats.streak}
          />
        );

      case 2:
        return (
          <DayReflection
            fadeAnim={fadeAnim}
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            journal={journal}
            onChangeJournal={setJournal}
            imageUris={imageUris}
            onPickImage={pickImage}
            onRemoveImage={removeImage}
          />
        );

      case 3:
        return <TomorrowTasks fadeAnim={fadeAnim} tasks={tomorrowTasks} />;

      case 4:
        return (
          <BedtimeReminder fadeAnim={fadeAnim} onComplete={handleComplete} />
        );

      default:
        return null;
    }
  };

  return (
    <View style={tw` p-3`}>
      <AutoHeightView>{renderStep()}</AutoHeightView>

      {/* Bottom Button */}
      {currentStep < 4 && (
        <Button
          title={currentStep === 3 ? "Complete Day" : "Continue"}
          onPress={handleNext}
          disabled={currentStep === 2 && !selectedMood}
        />
      )}
    </View>
  );
}
