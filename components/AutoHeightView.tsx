import React, { ReactNode, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, View, ViewStyle } from "react-native";

interface AutoHeightViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AutoHeightView({ children, style }: AutoHeightViewProps) {
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const animationHeight = useRef(new Animated.Value(0)).current;
  const animatingTo = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    if (height > 0) {
      // First measurement - set immediately without animation
      if (contentHeight === null) {
        setContentHeight(height);
        animationHeight.setValue(height);
        animatingTo.current = height;
        return;
      }

      // Check if we need to animate
      const heightDiff = Math.abs(height - contentHeight);
      const isAlreadyAnimatingToThisHeight = animatingTo.current === height;

      // Only animate if difference is significant and not already animating to this height
      if (heightDiff > 1 && !isAlreadyAnimatingToThisHeight) {
        // Stop any running animation
        animationHeight.stopAnimation(() => {
          // Start new animation
          animatingTo.current = height;
          isAnimating.current = true;

          Animated.timing(animationHeight, {
            toValue: height,
            duration: 400,
            useNativeDriver: false,
          }).start(() => {
            // Animation complete
            isAnimating.current = false;
            setContentHeight(height);
          });
        });
      }
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          height: contentHeight === null ? "auto" : animationHeight,
          overflow: "hidden",
        },
      ]}
    >
      <View onLayout={handleLayout}>{children}</View>
    </Animated.View>
  );
}
