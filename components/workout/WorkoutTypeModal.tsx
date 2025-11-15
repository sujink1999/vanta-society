import { FullScreenModal } from "@/components/FullScreenModal";
import { getTaskIcon } from "@/components/icons/TaskIcons";
import tw from "@/constants/tw";
import { WorkoutType } from "@/services/api/types";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WorkoutTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: WorkoutType) => void;
}

const WORKOUT_TYPES = [
  {
    type: "strength" as WorkoutType,
    taskName: "Strength Training",
    title: "Strength Training",
    color: "#FF5C2A",
  },
  {
    type: "cardio" as WorkoutType,
    taskName: "Running",
    title: "Cardio",
    color: "#4CAF50",
  },
  {
    type: "flexibility" as WorkoutType,
    taskName: "Meditation",
    title: "Flexibility / Yoga",
    color: "#9C27B0",
  },
  {
    type: "sports" as WorkoutType,
    taskName: "Workout",
    title: "Sports",
    color: "#2196F3",
  },
];

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;
const CARD_SPACING = 4;

export function WorkoutTypeModal({
  visible,
  onClose,
  onSelectType,
}: WorkoutTypeModalProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastHapticIndex = useRef<number>(-1);

  // Scroll to first item on mount
  React.useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: 0,
          animated: false,
        });
      }, 100);
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    const clampedIndex = Math.max(0, Math.min(index, WORKOUT_TYPES.length - 1));

    // Trigger haptic when crossing into a new item
    if (clampedIndex !== lastHapticIndex.current) {
      Haptics.selectionAsync();
      lastHapticIndex.current = clampedIndex;
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    const clampedIndex = Math.max(0, Math.min(index, WORKOUT_TYPES.length - 1));
    setSelectedIndex(clampedIndex);
  };

  const handleSelectType = (type: WorkoutType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectType(type);
    onClose();
  };

  return (
    <FullScreenModal visible={visible} closeOnOutsidePress={onClose}>
      <View style={tw``}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-6 p-3`}>
          <Text
            style={tw`text-white font-tussi text-base flex-1 text-center pt-3`}
          >
            What type of workout do you want to log?
          </Text>
        </View>

        {/* Horizontal Carousel */}
        <View style={tw`items-center`}>
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 16,
            }}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: true,
                listener: handleScroll,
              }
            )}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            style={{ width }}
          >
            <View
              style={{
                paddingLeft: (width - CARD_WIDTH) / 2,
                paddingRight: (width - CARD_WIDTH) / 2,
                flexDirection: "row",
              }}
            >
              {WORKOUT_TYPES.map((workout, index) => {
                const IconComponent = getTaskIcon(workout.taskName);

                const inputRange = [
                  (index - 1) * (CARD_WIDTH + CARD_SPACING),
                  index * (CARD_WIDTH + CARD_SPACING),
                  (index + 1) * (CARD_WIDTH + CARD_SPACING),
                ];

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.85, 1, 0.85],
                  extrapolate: "clamp",
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: "clamp",
                });

                return (
                  <TouchableOpacity
                    key={workout.type}
                    onPress={() => handleSelectType(workout.type)}
                    style={[
                      { width: CARD_WIDTH, marginRight: CARD_SPACING },
                      index === WORKOUT_TYPES.length - 1 && { marginRight: 0 },
                    ]}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale }],
                        opacity,
                      }}
                    >
                      <View style={tw`rounded-xl overflow-hidden bg-white/5`}>
                        <View style={tw`items-center justify-center p-2 pb-6 `}>
                          {/* Icon */}
                          <View
                            style={[
                              tw` h-16 rounded-xl items-center justify-center mb-3 w-full`,
                              // { backgroundColor: `${workout.color}20` },
                            ]}
                          >
                            {IconComponent && (
                              <IconComponent size={40} color={"white"} />
                            )}
                          </View>

                          {/* Title */}
                          <Text
                            style={tw`text-white font-mont-medium text-sm text-center`}
                          >
                            {workout.title}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    </FullScreenModal>
  );
}
