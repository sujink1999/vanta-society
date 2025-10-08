import tw from "@/constants/tw";
import { Product } from "@/services/api/types";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductPress: (product: Product) => void;
}

export function ProductGrid({
  products,
  loading,
  onProductPress,
}: ProductGridProps) {
  if (loading) {
    return (
      <View style={tw`px-4 gap-3`}>
        <View style={tw`flex-row gap-3`}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
        <View style={tw`flex-row gap-3`}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={tw`h-64 justify-center items-center`}>
        <Text style={tw`text-textSecondary font-mont text-sm`}>
          No products available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={tw`gap-3 px-4 `}
      contentContainerStyle={tw`gap-3  pb-[80px]`}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onProductPress(item)} />
      )}
    />
  );
}
