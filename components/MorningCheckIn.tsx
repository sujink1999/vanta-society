import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { getRandomQuote } from "@/constants/quotes";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTasks } from "@/hooks/useTasks";
import { constructTaskCommand } from "@/utils/taskHelpers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { AutoHeightView } from "./AutoHeightView";

interface MorningCheckInProps {
  onComplete: () => void;
}

const today = moment().format("YYYY-MM-DD");

export function MorningCheckIn({ onComplete }: MorningCheckInProps) {
  const { user } = useGlobalContext();
  const tasks = useTasks(today);
  const [currentStep, setCurrentStep] = useState(0);
  const [quote] = useState(getRandomQuote());
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation when step changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const handleNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    });
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
                — {quote.author}
              </Text>
            )}
          </Animated.View>
        );

      case 2:
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

      {/* Bottom Button */}
      <View style={tw`pt-3`}>
        <Button
          title={currentStep === 2 ? "Start Your Day" : "Continue"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
}
