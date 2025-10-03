import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";

interface CitationBlockProps {
  title: string;
  description: string;
  source: string;
}

export function CitationBlock({ title, description, source }: CitationBlockProps) {
  return (
    <View style={tw`bg-white/10 border border-white/20 rounded-lg p-4 mb-4`}>
      <Text style={tw`text-white font-mont-semibold text-base mb-2`}>
        {title}
      </Text>
      <Text style={tw`text-white/80 font-mont text-sm mb-3 leading-5`}>
        {description}
      </Text>
      <Text style={tw`text-primary font-mont text-xs`}>
        {source}
      </Text>
    </View>
  );
}