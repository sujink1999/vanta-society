import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface PulsingViewProps {
  children: React.ReactNode;
  scale?: number; // Max scale value (default 1.2)
  duration?: number; // Animation duration in ms (default 800)
}

export function PulsingView({
  children,
  scale = 1.2,
  duration = 800,
}: PulsingViewProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: scale,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scaleAnim, scale, duration]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
}
