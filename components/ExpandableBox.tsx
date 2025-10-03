import React, { useEffect, useRef, useState } from "react";
import { Animated, View, ViewStyle } from "react-native";

interface ExpandableBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animationDuration?: number;
}

export function ExpandableBox({
  children,
  style,
  animationDuration = 300,
}: ExpandableBoxProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (contentHeight === 0) {
      animatedHeight.setValue(0);
      return;
    }

    setIsAnimating(true);
    Animated.timing(animatedHeight, {
      toValue: contentHeight,
      duration: animationDuration,
      useNativeDriver: false,
    }).start(() => {
      setIsAnimating(false);
    });
  }, [contentHeight, animationDuration, animatedHeight]);

  if (!children) {
    return null;
  }

  return (
    <Animated.View style={[{ height: animatedHeight }, style]}>
      <View
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && height !== contentHeight) {
            setContentHeight(height);
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}