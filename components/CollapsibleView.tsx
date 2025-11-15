import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, View, ViewStyle } from "react-native";

interface CollapsibleViewProps {
  children: ReactNode;
  isExpanded: boolean;
  style?: ViewStyle;
}

export function CollapsibleView({ children, isExpanded, style }: CollapsibleViewProps) {
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const animatedHeight = useRef(new Animated.Value(1)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!maxHeight) {
      setMaxHeight(event.nativeEvent.layout.height);
    }
  };

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight || 1000], // Use a large number as fallback
  });

  return (
    <Animated.View
      style={[
        style,
        {
          height: maxHeight ? heightInterpolate : undefined,
          overflow: "hidden",
        },
      ]}
    >
      <View onLayout={handleLayout}>
        {children}
      </View>
    </Animated.View>
  );
}