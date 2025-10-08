import tw from "@/constants/tw";
import { MarketplaceItem } from "@/services/api/types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon } from "./icons/Icons";

interface BrandCardProps {
  brand: MarketplaceItem;
  onPress: () => void;
}

export function BrandCard({ brand, onPress }: BrandCardProps) {
  const hasDiscountCode = !!brand.discountCode;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw` overflow-hidden w-44 relative border border-white/5 bg-white/5 `}
      activeOpacity={0.7}
    >
      <View
        style={tw`absolute -left-[10px] -bottom-[10px] rotate-[315deg] opacity-50`}
      >
        <ChevronLeftIcon size={25} color="white" />
      </View>

      {/* <View style={tw`absolute -left-[10px] -bottom-[10px] rotate-[315deg]`}>
        <ChevronLeftIcon size={25} color="white" />
      </View> */}

      {/* Image */}
      <View style={tw`h-30 flex-row items-center justify-start pl-3`}>
        <Image
          source={{ uri: brand.imageUrl }}
          style={tw`h-20 w-20 rounded-full`}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={tw`p-3 flex-col gap-3`}>
        <Text
          style={tw`text-white text-left font-tussi-bold text-xs`}
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
        style={tw` absolute top-2 right-2 bg-white/10 px-2 py-1 self-center`}
      >
        <Text style={tw`text-white font-mont-bold text-[10px]`}>
          {brand.discountPercentage}% OFF
        </Text>
      </View>
    </TouchableOpacity>
  );
}
