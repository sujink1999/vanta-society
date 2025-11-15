import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { PlatformBlurView } from "@/components/PlatformBlurView";
import tw from "@/constants/tw";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  lightColor?: string;
  animationDuration?: number;
  onPress?: () => void;
  disabled?: boolean;
  tint?: "dark" | "light";
  enableHaptics?: boolean;
  enableSound?: boolean;
  hapticStyle?: "light" | "medium" | "heavy";
  outerCardStyle?: StyleProp<ViewStyle>;
  lightSize?: number;
  roundedClassName?: string;
}

export default function GlassCard({
  children,
  outerCardStyle,
  style,
  intensity = 40,
  lightColor = "#FFFFFF",
  animationDuration = 300,
  onPress,
  disabled = false,
  tint = "dark",
  enableHaptics = true,
  enableSound = true,
  hapticStyle = "light",
  lightSize = 100,
  roundedClassName = "rounded-md",
}: GlassCardProps) {
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const lightOpacity = useRef(new Animated.Value(0)).current;
  const lightScale = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const playSound = async () => {
    if (enableSound) {
      try {
        // Use system keyboard tap sound as a subtle click
        // This is more performant and doesn't require external files
        if (Platform.OS === "ios") {
          // iOS system sounds don't require loading
          await Haptics.selectionAsync();
        } else {
          // Android: Use a softer haptic as audio feedback
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
      } catch (error) {
        // Silently fail if sound doesn't play
      }
    }
  };

  const triggerHaptics = async () => {
    if (enableHaptics) {
      try {
        let impactStyle: Haptics.ImpactFeedbackStyle;
        switch (hapticStyle) {
          case "medium":
            impactStyle = Haptics.ImpactFeedbackStyle.Medium;
            break;
          case "heavy":
            impactStyle = Haptics.ImpactFeedbackStyle.Heavy;
            break;
          default:
            impactStyle = Haptics.ImpactFeedbackStyle.Light;
        }
        await Haptics.impactAsync(impactStyle);
      } catch (error) {
        // Silently fail if haptics not available
      }
    }
  };

  const handlePressIn = async (event: GestureResponderEvent) => {
    // Get the touch coordinates relative to the Pressable component
    // Need to account for any padding or borders that might offset the position
    const { locationX, locationY } = event.nativeEvent;
    // Store the exact touch position
    setTouchPosition({ x: locationX, y: locationY });

    // Trigger haptics and sound
    await triggerHaptics();
    playSound();

    // Animate the light blob in
    Animated.parallel([
      Animated.timing(lightOpacity, {
        toValue: 0.8,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.spring(lightScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 0.98,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    // Animate the light blob out
    Animated.parallel([
      Animated.timing(lightOpacity, {
        toValue: 0,
        duration: animationDuration * 1.5,
        useNativeDriver: true,
      }),
      Animated.timing(lightScale, {
        toValue: 0,
        duration: animationDuration * 1.5,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        tw`relative border border-white/10 overflow-hidden`,
        roundedClassName && tw`${roundedClassName}`,
        { transform: [{ scale: cardScale }] },
        outerCardStyle,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
      >
        <View
          style={[
            tw`relative overflow-hidden`,
            roundedClassName && tw`${roundedClassName}`,
          ]}
        >
          {/* Animated light blob - positioned BEHIND the blur */}
          <Animated.View
            style={[
              tw`absolute inset-0`,
              {
                opacity: lightOpacity,
              },
            ]}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                tw`absolute`,
                {
                  width: lightSize,
                  height: lightSize,
                  left: touchPosition.x - lightSize / 2,
                  top: touchPosition.y - lightSize / 2,
                  transform: [{ scale: lightScale }],
                },
              ]}
            >
              <View
                style={[
                  tw`w-full h-full rounded-full`,
                  {
                    backgroundColor: lightColor,
                    shadowColor: lightColor,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 80,
                    elevation: 20,
                  },
                ]}
              />
            </Animated.View>
          </Animated.View>

          {/* Glass card that sits on top of the light */}
          <PlatformBlurView
            intensity={intensity}
            opacity={Platform.OS === "ios" ? 0.8 : 0.9}
            tint={tint}
            style={[
              tw`overflow-hidden`,
              roundedClassName && tw`${roundedClassName}`,
              style,
            ]}
          >
            {children}
          </PlatformBlurView>
        </View>
      </Pressable>
    </Animated.View>
  );
}
