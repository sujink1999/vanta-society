import React, { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import tw from "@/constants/tw";

interface RoutineGenerationLoaderProps {
  visible: boolean;
}

export function RoutineGenerationLoader({ visible }: RoutineGenerationLoaderProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const dotsValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Continuous spin animation
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      // Continuous pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Animated dots for text
      const dotsAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotsValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotsValue, {
            toValue: 2,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotsValue, {
            toValue: 3,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotsValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );

      spinAnimation.start();
      pulseAnimation.start();
      dotsAnimation.start();

      return () => {
        spinAnimation.stop();
        pulseAnimation.stop();
        dotsAnimation.stop();
      };
    } else {
      Animated.timing(fadeValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, spinValue, pulseValue, fadeValue, dotsValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`flex-1 justify-center items-center bg-black px-6`,
        { opacity: fadeValue }
      ]}
    >
      {/* Main Spinner */}
      <Animated.View
        style={[
          tw`w-20 h-20 rounded-full border-4 border-white/20 border-t-primary items-center justify-center mb-8`,
          {
            transform: [
              { rotate: spin },
              { scale: pulseValue },
            ],
          },
        ]}
      >
        <View style={tw`w-8 h-8 rounded-full bg-primary`} />
      </Animated.View>

      {/* Loading Text */}
      <View style={tw`items-center`}>
        <Text style={tw`text-white font-tussi-bold text-xl mb-2 text-center`}>
          Getting your routine from AI
        </Text>

        {/* Animated Dots */}
        <Animated.View style={tw`flex-row`}>
          {[0, 1, 2].map((index) => (
            <Animated.Text
              key={index}
              style={[
                tw`text-primary font-mont-bold text-xl`,
                {
                  opacity: dotsValue.interpolate({
                    inputRange: [index, index + 0.5, index + 1],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              .
            </Animated.Text>
          ))}
        </Animated.View>

        <Text style={tw`text-white/60 font-mont text-sm text-center mt-4 leading-5`}>
          AI is analyzing your goals and creating{'\n'}a personalized routine just for you
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={tw`mt-8 w-full max-w-xs`}>
        <View style={tw`flex-row justify-between mb-2`}>
          {[0, 1, 2, 3].map((index) => (
            <Animated.View
              key={index}
              style={[
                tw`w-2 h-2 rounded-full`,
                {
                  backgroundColor: dotsValue.interpolate({
                    inputRange: [index - 0.5, index, index + 0.5],
                    outputRange: ['rgba(255, 92, 42, 0.3)', '#FF5C2A', 'rgba(255, 92, 42, 0.3)'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}