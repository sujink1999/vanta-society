import tw from "@/constants/tw";
import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  View,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

interface SafeAreaBackgroundProps {
  imageSource?: ImageSourcePropType;
  backgroundColor?: string;
  overlayOpacity?: number; // 0-1, for dark overlay on image
  edges?: Edge[];
  children: React.ReactNode;
  style?: ViewStyle;
  blurRadius?: number;
}

export function SafeAreaBackground({
  imageSource,
  backgroundColor = "#000000",
  overlayOpacity = 0,
  edges,
  children,
  style,
  blurRadius = 0,
}: SafeAreaBackgroundProps) {
  if (imageSource) {
    return (
      <View style={tw`flex-1`}>
        <ImageBackground
          source={imageSource}
          style={tw`absolute inset-0 w-full h-full`}
          resizeMode="cover"
          blurRadius={blurRadius}
        >
          {overlayOpacity > 0 && (
            <View
              style={[
                tw`flex-1`,
                { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
              ]}
            />
          )}
        </ImageBackground>

        <SafeAreaView style={[tw`flex-1`, style]} edges={edges || undefined}>
          {children}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
