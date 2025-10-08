import tw from "@/constants/tw";
import { Product } from "@/services/api/types";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const hasNotification = product.userRequestedNotification;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`overflow-hidden flex-1 relative border border-white/5 bg-white/5`}
      activeOpacity={0.7}
    >
      {/* Image */}
      <View style={tw` flex-row items-center py-3 `}>
        <Image
          source={{ uri: product.imageUrl }}
          style={tw`h-30 w-full `}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={tw`p-3`}>
        <Text
          style={tw`text-white text-center font-tussi-bold text-xs mb-3`}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Price or Notification Status */}
        <Text style={tw`text-primary text-center font-mont-medium text-sm`}>
          ${product.finalCost.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
