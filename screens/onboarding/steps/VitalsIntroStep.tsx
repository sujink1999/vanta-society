import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import tw from "@/constants/tw";
import { VideoView, useVideoPlayer } from "expo-video";
import React from "react";
import { Text, View } from "react-native";

interface VitalsIntroStepProps {
  onNext: () => void;
  loading?: boolean;
}

export function VitalsIntroStep({ onNext, loading }: VitalsIntroStepProps) {
  const player = useVideoPlayer(require("@/assets/videos/aura-cut.mp4"), (player) => {
    player.muted = true;
    player.loop = false;
  });

  return (
    <View style={tw`flex-1 px-3 pt-8 pb-6`}>
      {/* Intro Screen */}
      <View style={tw`flex-1 items-center justify-between`}>
        <View />
        <View style={tw`flex flex-col items-center`}>
          <GradientText style={tw`font-tussi-bold text-lg text-center `}>
            VITALS SCORE
          </GradientText>
          <Text
            style={tw`text-textSecondary font-mont text-base text-center mb-8 leading-6 mt-2`}
          >
            Get your baseline based on your answers
          </Text>
        </View>

        {/* Video */}
        <View style={tw`h-64 w-64 rounded-lg mb-12 overflow-hidden`}>
          <VideoView
            player={player}
            style={tw`flex-1 w-full`}
            contentFit="cover"
            nativeControls={true}
          />
        </View>
        <View />

        <Button
          title="GENERATE YOUR VITALS SCORE"
          onPress={onNext}
          loading={loading}
          textStyle={tw`text-xs`}
          style={tw`w-full`}
        />
      </View>
    </View>
  );
}
