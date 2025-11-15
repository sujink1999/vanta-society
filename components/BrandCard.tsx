import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { MarketplaceItem } from "@/services/api/types";
import React from "react";
import { Image, Text, View } from "react-native";
import GlassCard from "./GlassCard";

interface BrandCardProps {
  brand: MarketplaceItem;
  onPress: () => void;
}

export function BrandCard({ brand, onPress }: BrandCardProps) {
  const hasDiscountCode = !!brand.discountCode;

  return (
    <GlassCard
      onPress={onPress}
      outerCardStyle={tw`border-white/20 border   w-44`}
      intensity={60}
      tint="dark"
      lightColor={Colors.white}
      hapticStyle="light"
      enableHaptics={true}
      enableSound={true}
      roundedClassName="rounded-lg"
    >
      {/* <View style={tw`absolute -left-[10px] -bottom-[10px] rotate-[315deg]`}>
        <ChevronLeftIcon size={25} color="white" />
      </View> */}

      {/* Image */}
      <View style={tw`h-30 flex-row items-center justify-start pl-3 pt-3`}>
        <Image
          source={{ uri: brand.imageUrl }}
          style={tw`h-20 w-20 `}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={tw`p-3 flex-col gap-3`}>
        <Text
          style={tw`text-white/80 text-left font-tussi-bold text-xs`}
          numberOfLines={2}
        >
          {brand.companyName}
        </Text>

        <View style={tw`bg-white px-3 py-1 self-start rounded-full`}>
          <Text
            style={tw`text-black text-left font-mont-medium text-[11px] lowercase`}
          >
            {brand.brandType}
          </Text>
        </View>
      </View>

      <View
        style={tw` absolute top-2 right-2 bg-white/5 px-2 py-1 self-center`}
      >
        <Text style={tw`text-white/60 font-mont-bold text-[10px]`}>
          {brand.discountPercentage}% OFF
        </Text>
      </View>
    </GlassCard>
  );
}
