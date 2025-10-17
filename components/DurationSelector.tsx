import tw from "@/constants/tw";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DurationOption {
  label: string;
  value: number;
}

interface DurationSelectorProps {
  options: DurationOption[];
  selectedDuration: number;
  onSelect: (value: number) => void;
}

const ITEM_HEIGHT = 60;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CONTAINER_HEIGHT = SCREEN_HEIGHT * 0.5;

export function DurationSelector({
  options,
  selectedDuration,
  onSelect,
}: DurationSelectorProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const lastHapticIndex = useRef<number>(-1);

  // Scroll to selected duration on mount
  useEffect(() => {
    const selectedIndex = options.findIndex(
      (opt) => opt.value === selectedDuration
    );
    if (selectedIndex >= 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: true,
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));

    // Trigger haptic when crossing into a new item
    if (clampedIndex !== lastHapticIndex.current) {
      Haptics.selectionAsync();
      lastHapticIndex.current = clampedIndex;
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));

    if (options[clampedIndex]) {
      onSelect(options[clampedIndex].value);
    }
  };

  const handleItemPress = (value: number, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
    scrollViewRef.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <View
      style={[
        tw`justify-center items-center relative `,
        { height: CONTAINER_HEIGHT },
      ]}
    >
      {/* Center highlight indicator */}
      <View
        style={[
          tw`absolute w-full bg-white/5 border-t border-b border-white/10 z-0 `,
          { height: ITEM_HEIGHT },
        ]}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
          paddingBottom: (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2,
        }}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: handleScroll,
          }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={tw`flex-1 w-full`}
      >
        {options.map((option, index) => {
          const isSelected = selectedDuration === option.value;

          const inputRange = [
            (index - 3) * ITEM_HEIGHT,
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
            (index + 3) * ITEM_HEIGHT,
          ];

          // Rotation for wheel effect (items rotate around X-axis)
          const rotateX = scrollY.interpolate({
            inputRange,
            outputRange: [
              "-60deg",
              "-40deg",
              "-20deg",
              "0deg",
              "20deg",
              "40deg",
              "60deg",
            ],
            extrapolate: "clamp",
          });

          // Scale - center item is largest
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.6, 0.75, 0.9, 1.1, 0.9, 0.75, 0.6],
            extrapolate: "clamp",
          });

          // Opacity - center is most visible
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.2, 0.4, 0.6, 1, 0.6, 0.4, 0.2],
            extrapolate: "clamp",
          });

          // Translation for depth effect
          const translateY = scrollY.interpolate({
            inputRange,
            outputRange: [0, 0, 0, 0, 0, 0, 0],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleItemPress(option.value, index)}
              activeOpacity={0.7}
              style={[{ height: ITEM_HEIGHT }, tw`justify-center items-center`]}
            >
              <Animated.View
                style={[
                  tw`items-center justify-center w-full`,
                  {
                    transform: [
                      { perspective: 1000 },
                      { rotateX },
                      { scale },
                      { translateY },
                    ],
                    opacity,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-tussi text-2xl`,
                    isSelected ? tw`text-primary` : tw`text-white/80`,
                  ]}
                >
                  {option.label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
