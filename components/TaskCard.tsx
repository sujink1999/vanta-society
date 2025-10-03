import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { UserRoutine } from "@/services/api/types";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { CycleIcon } from "./icons/Icons";
import { getTaskIcon } from "./icons/TaskIcons";

interface TaskCardProps {
  task: UserRoutine;
  categoryColor: string;
  taskCommand: string;
  frequency: string;
  onSkip?: () => Promise<boolean>;
  onDone?: () => Promise<boolean>;
  onRefresh?: () => void;
  activeTab: "todos" | "done" | "skipped";
  isToday?: boolean;
}

export function TaskCard({
  task,
  categoryColor,
  taskCommand,
  frequency,
  onSkip,
  onDone,
  onRefresh,
  activeTab,
  isToday = true,
}: TaskCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const IconComponent = getTaskIcon(task.taskName);

  const canUpdate = activeTab === "todos" && isToday;

  useEffect(() => {
    if (showOverlay) {
      setOverlayVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setOverlayVisible(false);
      });
    }
  }, [showOverlay, fadeAnim]);

  const handleSkip = async () => {
    setIsProcessing(true);
    try {
      await onSkip?.();
      setShowOverlay(false);
      onRefresh?.();
    } catch (error) {
      console.error("Failed to skip task:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDone = async () => {
    setIsProcessing(true);
    try {
      await onDone?.();
      onRefresh?.();
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View>
      <LinearGradient
        colors={[`#ffffff05`, "#FFFFFF10"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={tw`rounded-md border border-white/5`}
      >
        <TouchableHighlight onPress={() => canUpdate && setShowOverlay(true)}>
          <View style={tw`flex-row p-3`}>
            {IconComponent && (
              <View style={tw`mr-3`}>
                <IconComponent size={24} color={categoryColor} />
              </View>
            )}

            <View style={tw`flex-1 flex-col gap-2`}>
              <Text
                style={tw`text-white font-mont-medium text-sm`}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {taskCommand}
              </Text>

              <View style={tw`flex-row items-center`}>
                <CycleIcon size={12} color={Colors.textSecondary} />
                <Text
                  style={tw`text-textSecondary font-mont-medium text-xs ml-2`}
                  numberOfLines={1}
                >
                  {frequency}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        {/* Overlay with BlurView */}
        {overlayVisible && (
          <Animated.View
            style={[
              tw`absolute inset-0 rounded-md overflow-hidden`,
              { opacity: fadeAnim },
            ]}
          >
            <BlurView
              intensity={20}
              style={tw`flex-1 justify-center items-center`}
              onTouchEnd={() => setShowOverlay(false)}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                showOverlay && (
                  <View
                    style={tw`flex-row gap-4 items-center`}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    {/* Skip Button */}
                    <TouchableOpacity
                      style={[
                        tw`bg-white px-6 py-[6px] rounded-sm`,
                        isProcessing && tw`opacity-50`,
                      ]}
                      onPress={handleSkip}
                      disabled={isProcessing}
                    >
                      <Text style={tw`text-black font-tussi text-xs`}>
                        {isProcessing ? "..." : "Skip"}
                      </Text>
                    </TouchableOpacity>

                    {/* Done Button */}
                    <TouchableOpacity
                      style={[
                        tw`px-6 py-[6px] rounded-sm`,
                        { backgroundColor: Colors.primary },
                        isProcessing && tw`opacity-50`,
                      ]}
                      onPress={handleDone}
                      disabled={isProcessing}
                    >
                      <Text style={tw`text-white font-tussi text-xs`}>
                        {isProcessing ? "..." : "Done"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </BlurView>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
}
