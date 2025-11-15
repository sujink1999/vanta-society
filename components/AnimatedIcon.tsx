import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedIconProps {
  children: React.ReactNode;
  rotationDuration?: number;
  scaleDuration?: number;
  minScale?: number;
  maxScale?: number;
}

export function AnimatedIcon({
  children,
  rotationDuration = 2000,
  scaleDuration = 1000,
  minScale = 0.8,
  maxScale = 1,
}: AnimatedIconProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(maxScale)).current;

  useEffect(() => {
    // Rotation animation - continuous loop
    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: rotationDuration,
        useNativeDriver: true,
      })
    );

    // Scale animation - pulsing effect
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: minScale,
          duration: scaleDuration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: maxScale,
          duration: scaleDuration,
          useNativeDriver: true,
        }),
      ])
    );

    // Start both animations
    rotationAnimation.start();
    scaleAnimation.start();

    // Cleanup
    return () => {
      rotationAnimation.stop();
      scaleAnimation.stop();
    };
  }, [
    rotateAnim,
    scaleAnim,
    rotationDuration,
    scaleDuration,
    minScale,
    maxScale,
  ]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate: rotation }, { scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}
