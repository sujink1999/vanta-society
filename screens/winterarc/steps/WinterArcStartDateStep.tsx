import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calendar";
import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { submitWinterArcStart } from "@/services/api/users";
import { router } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

interface WinterArcStartDateStepProps {
  onNext: () => void;
}

export function WinterArcStartDateStep({
  onNext,
}: WinterArcStartDateStepProps) {
  const { refetchUserSilently } = useGlobalContext();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const response = await submitWinterArcStart({
        startDate: selectedDate,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (response.success) {
        await refetchUserSilently();
        // Redirect to tabs instead of calling onNext
        router.replace("/(tabs)/winterarc");
      } else {
        Alert.alert(
          "Error",
          "Failed to set Winter Arc start date. Please try again."
        );
      }
    } catch (error) {
      console.error("Error setting Winter Arc start date:", error);
      Alert.alert(
        "Error",
        "Failed to set Winter Arc start date. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 px-3 pt-8 pb-6`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw` flex-col items-center gap-3`}>
          <GradientText
            style={tw`text-textPrimary text-center font-tussi-bold text-3xl`}
          >
            START DATE
          </GradientText>

          <Text
            style={tw`text-textSecondary font-mont text-sm text-center max-w-[300px]`}
          >
            Select the date you want to start your 66-day Winter Arc
          </Text>
        </View>

        <View style={tw`w-full pt-10 `}>
          <Calendar
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
            minDate={moment().add(2, "days").format("YYYY-MM-DD")}
            colorCodedRange={{
              startDate: selectedDate,
              numberOfDays: 66,
              color: "#FF5C2A",
            }}
          />
        </View>

        {selectedDate && (
          <Text
            style={tw`text-textSecondary font-mont text-base text-center max-w-[300px] mx-auto py-6`}
          >
            Your Winter Arc will end on{"\n"}
            <Text style={tw`text-textPrimary font-mont-medium text-lg`}>
              {moment(selectedDate).add(65, "days").format("MMM DD, YYYY")}
            </Text>
          </Text>
        )}
      </ScrollView>

      <Button
        title="CONFIRM"
        onPress={handleNext}
        disabled={!selectedDate}
        loading={isLoading}
      />
    </View>
  );
}
