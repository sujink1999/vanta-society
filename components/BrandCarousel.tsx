import tw from "@/constants/tw";
import { MarketplaceItem } from "@/services/api/types";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { BrandCard } from "./BrandCard";
import { BrandCardSkeleton } from "./BrandCardSkeleton";

interface BrandCarouselProps {
  brands: MarketplaceItem[];
  loading: boolean;
  onBrandPress: (brand: MarketplaceItem) => void;
}

export function BrandCarousel({
  brands,
  loading,
  onBrandPress,
}: BrandCarouselProps) {
  if (loading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4 gap-3`}
        scrollEnabled={false}
      >
        {[1, 2, 3].map((i) => (
          <BrandCardSkeleton key={i} />
        ))}
      </ScrollView>
    );
  }

  if (brands.length === 0) {
    return (
      <View style={tw`h-64 justify-center items-center`}>
        <Text style={tw`text-textSecondary font-mont text-sm`}>
          No brands available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={brands}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      snapToInterval={280}
      decelerationRate="fast"
      contentContainerStyle={tw`px-4 gap-3`}
      renderItem={({ item }) => (
        <BrandCard brand={item} onPress={() => onBrandPress(item)} />
      )}
    />
  );
}
