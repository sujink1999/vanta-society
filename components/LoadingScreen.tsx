import tw from "@/constants/tw";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOADING_MESSAGES = [
  "Evolving...",
  "Growing...",
  "Building...",
  "Leveling up...",
  "Improving...",
  "Progressing...",
  "Ascending...",
  "Transforming...",
];

export function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const [message] = useState(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );

  useEffect(() => {
    // Pulsing fade animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <Animated.Image
          source={require("@/assets/images/society-logo-no-bg.png")}
          style={[tw`w-32 h-32`, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
        <Animated.Text
          style={[
            tw`text-sm font-tussi text-textSecondary`,
            { opacity: fadeAnim },
          ]}
        >
          {message}
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}
