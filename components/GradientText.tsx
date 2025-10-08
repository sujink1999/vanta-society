import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface GradientTextProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

export function GradientText({
  children,
  colors = ["#FFFFFF", "#999999"] as const,
  locations = [0, 0.7] as const,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  style,
  containerStyle,
}: GradientTextProps) {
  const [textLayout, setTextLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTextLayout({ width, height });
  };

  return (
    <View style={containerStyle}>
      {/* Invisible text to measure dimensions - always rendered */}
      <Text
        style={[style, { opacity: 0 }]}
        onLayout={handleTextLayout}
      >
        {children}
      </Text>

      {/* Gradient text - positioned absolutely over invisible text */}
      {textLayout && (
        <MaskedView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: textLayout.width,
            height: textLayout.height,
          }}
          maskElement={<Text style={style}>{children}</Text>}
        >
          <LinearGradient
            colors={colors}
            locations={locations}
            start={start}
            end={end}
            style={{ flex: 1 }}
          />
        </MaskedView>
      )}
    </View>
  );
}
