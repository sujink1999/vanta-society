import tw from "@/constants/tw";
import React from "react";
import { View } from "react-native";
import { Shimmer } from "./Shimmer";

export function ProductCardSkeleton() {
  return (
    <View
      style={tw`overflow-hidden flex-1 relative border border-white/5 bg-white/5`}
    >
      {/* Image */}
      <View style={tw`flex-row items-center py-3 px-4`}>
        <Shimmer width="100%" height={120} borderRadius={4} />
      </View>

      {/* Content */}
      <View style={tw`p-3 items-center gap-3`}>
        <Shimmer width="80%" height={12} borderRadius={4} />
        <Shimmer width="40%" height={16} borderRadius={4} />
      </View>
    </View>
  );
}
