import tw from "@/constants/tw";
import React from "react";
import { Image, Text, View } from "react-native";

interface CitationCardWithImageProps {
  citation: string;
  reference: string;
  imageSource: any;
}

export function CitationCardWithImage({
  citation,
  reference,
  imageSource,
}: CitationCardWithImageProps) {
  return (
    <View style={tw`bg-white/8 rounded-lg p-4 flex-row`}>
      <View style={tw`mr-4 items-center justify-start`}>
        <Image
          source={imageSource}
          style={tw`w-12 h-20 `}
          resizeMode="contain"
        />
      </View>

      <View style={tw`flex-1 flex-col gap-3`}>
        <Text style={tw`text-white/90 font-mont text-sm leading-5`}>
          &quot;{citation}&quot;
        </Text>
        <View style={tw`h-[1px] bg-white/10 w-full`} />
        <Text style={tw`text-white/60 font-mont text-xs leading-4`}>
          {reference}
        </Text>
      </View>
    </View>
  );
}
