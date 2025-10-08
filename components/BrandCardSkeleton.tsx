import tw from "@/constants/tw";
import React from "react";
import { View } from "react-native";
import { Shimmer } from "./Shimmer";

export function BrandCardSkeleton() {
  return (
    <View
      style={tw`overflow-hidden w-44 relative border border-white/5 bg-white/5`}
    >
      {/* Image */}
      <View style={tw`h-30 flex-row items-center justify-start pl-3`}>
        <Shimmer width={80} height={80} borderRadius={40} />
      </View>

      {/* Content */}
      <View style={tw`p-3 flex-col gap-3`}>
        <Shimmer width="80%" height={12} borderRadius={4} />
        <Shimmer width="50%" height={24} borderRadius={12} />
      </View>

      {/* Discount badge */}
      <View style={tw`absolute top-2 right-2`}>
        <Shimmer width={60} height={20} borderRadius={4} />
      </View>
    </View>
  );
}
