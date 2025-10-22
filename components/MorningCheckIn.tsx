import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { OPTION_TYPES } from "@/constants/optionTypes";
import { getRandomQuote } from "@/constants/quotes";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useTasks } from "@/hooks/useTasks";
import { appActivityStorageManager } from "@/services/storage/AppActivityStorageManager";
import { constructTaskCommand } from "@/utils/taskHelpers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { AutoHeightView } from "./AutoHeightView";
import { SleepConfirmation } from "./MorningCheckIn/SleepConfirmation";

interface MorningCheckInProps {
  onComplete: () => void;
}

const today = moment().format("YYYY-MM-DD");

export function MorningCheckIn({ onComplete }: MorningCheckInProps) {
  const { user, routine } = useGlobalContext();
  const tasks = useTasks(today);
  const [currentStep, setCurrentStep] = useState(0);
  const [quote] = useState(getRandomQuote());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showSleepConfirmation, setShowSleepConfirmation] = useState(false);
  const [isCheckingSleep, setIsCheckingSleep] = useState(true);

  const { markTaskDone } = useTaskActions(today);

  useEffect(() => {
    // Fade in animation when step changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  useEffect(() => {
    // Check if we should show sleep confirmation
    const checkSleepActivity = async () => {
      try {
        // Find wake time from routine
        const wakeTask = routine.find(
          (r) => r.taskName === "Consistent wake time"
        );

        if (!wakeTask) {
          // No wake time set, don't show sleep confirmation
          setIsCheckingSleep(false);
          return;
        }

        const timeOption = wakeTask.optionsSet.find(
          (opt) =>
            opt.type === "time" || opt.name.toLowerCase().includes("time")
        );

        if (!timeOption || !timeOption.value) {
          setIsCheckingSleep(false);
          return;
        }

        // Parse wake time
        const wakeTime = moment(timeOption.value, [
          "h:mm A",
          "h:mm a",
          "hh:mm A",
          "hh:mm a",
        ]);

        if (!wakeTime.isValid()) {
          setIsCheckingSleep(false);
          return;
        }

        // Calculate sleep hours (wake_time - 8 hours to wake_time)
        const sleepStart = moment()
          .hour(wakeTime.hour())
          .minute(wakeTime.minute())
          .subtract(8, "hours");
        const sleepEnd = moment()
          .hour(wakeTime.hour())
          .minute(wakeTime.minute())
          .subtract(30, "minutes");

        // Check for app activity during sleep hours
        const activities =
          await appActivityStorageManager.getActivityDuringPeriod(
            sleepStart.toISOString(),
            sleepEnd.toISOString()
          );

        // Show confirmation only if there's NO activity
        if (activities.length === 0) {
          setShowSleepConfirmation(true);
        }
      } catch (error) {
        console.error("Error checking sleep activity:", error);
      } finally {
        setIsCheckingSleep(false);
      }
    };

    checkSleepActivity();
  }, [routine]);

  const handleSleepYes = async () => {
    // Mark "Sleep for 8 hours" task as complete
    const sleepTask = routine.find((r) => r.taskName === "Sleep for 8 hours");
    if (sleepTask) {
      await markTaskDone(sleepTask.id);
    }

    // Move to next step
    handleNext();
  };

  const handleSleepNo = () => {
    // Just move to next step without marking complete
    handleNext();
  };

  const handleNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentStep === 0 && !showSleepConfirmation) {
        // Skip sleep confirmation step, jump directly to quote
        setCurrentStep(2);
      } else if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    });
  };

  const handleComplete = async () => {
    // Auto-mark "Consistent wake time" if completed within window
    try {
      const wakeTask = routine.find(
        (r) => r.taskName === "Consistent wake time"
      );

      if (wakeTask) {
        const timeOption = wakeTask.optionsSet.find(
          (opt) => opt.type === OPTION_TYPES.TIME_OF_DAY
        );

        if (timeOption && timeOption.value) {
          const wakeTime = moment(timeOption.value, [
            "h:mm A",
            "h:mm a",
            "hh:mm A",
            "hh:mm a",
          ]);

          if (wakeTime.isValid()) {
            const now = moment();
            const wakeTimeToday = moment()
              .hour(wakeTime.hour())
              .minute(wakeTime.minute())
              .second(0);

            const windowStart = wakeTimeToday.clone().subtract(2, "hours");
            const windowEnd = wakeTimeToday.clone().add(30, "minutes");

            // Check if current time is within the window
            if (now.isBetween(windowStart, windowEnd, undefined, "[]")) {
              markTaskDone(wakeTask.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error auto-completing wake time task:", error);
    }

    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // Greeting
        return (
          <Animated.View
            style={[
              tw`justify-center items-center px-6 min-h-[250px]`,
              { opacity: fadeAnim },
            ]}
          >
            <Text style={tw`text-white/60 font-mont text-lg mb-4`}>
              Good morning,
            </Text>
            <GradientText style={tw`text-white font-tussi text-5xl`}>
              {user?.firstName || "Champion"}
            </GradientText>
          </Animated.View>
        );

      case 1:
        // Sleep Confirmation
        return <SleepConfirmation fadeAnim={fadeAnim} />;

      case 2:
        // Quote
        return (
          <Animated.View
            style={[
              tw`justify-center items-center px-3 min-h-[250px]`,
              { opacity: fadeAnim },
            ]}
          >
            <Text
              style={tw`text-white font-tussi text-lg text-center mb-6 leading-9`}
            >
              &quot; {quote.text} &quot;
            </Text>
            {quote.author !== "Unknown" && (
              <Text style={tw`text-white/60 font-mont-medium text-sm`}>
                - {quote.author}
              </Text>
            )}
          </Animated.View>
        );

      case 3:
        // Tasks Preview
        return (
          <Animated.View style={[tw` px-2 pt-2`, { opacity: fadeAnim }]}>
            <View style={tw`mb-3`}>
              <Text style={tw`text-textSecondary font-tussi text-xl mb-2`}>
                Today&apos;s Tasks
              </Text>
            </View>

            <View style={tw`gap-3 pb-6`}>
              {tasks.map((task, index) => {
                const taskCommand = constructTaskCommand(
                  task.taskText,
                  task.taskName,
                  task.optionsSet
                );

                return (
                  <View key={task.id} style={tw`flex-row items-center gap-2`}>
                    <Text style={tw`text-white/40 font-mont text-xs`}>
                      {index + 1}.
                    </Text>
                    <Text
                      style={tw`text-white font-mont text-sm flex-1`}
                      numberOfLines={1}
                    >
                      {taskCommand}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={tw`p-3`}>
      <AutoHeightView>{renderStep()}</AutoHeightView>

      {/* Bottom Button - hide on sleep confirmation step */}
      {currentStep !== 1 ? (
        <View style={tw`pt-3`}>
          <Button
            title={currentStep === 3 ? "Start Your Day" : "Continue"}
            onPress={handleNext}
            disabled={isCheckingSleep}
          />
        </View>
      ) : (
        <View style={tw`w-full flex-row gap-3 pt-3`}>
          <View style={tw`flex-1`}>
            <Button
              title="No"
              onPress={handleSleepNo}
              style={tw`bg-white/10`}
            />
          </View>
          <View style={tw`flex-1`}>
            <Button title="Yes" onPress={handleSleepYes} />
          </View>
        </View>
      )}
    </View>
  );
}
