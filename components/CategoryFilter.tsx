import tw from "@/constants/tw";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`px-3 gap-2`}
      style={tw`flex-grow-0`}
    >
      {/* "All" filter */}
      <TouchableOpacity
        style={[
          tw`px-4 py-1 rounded-md border`,
          selectedCategory === null
            ? tw`bg-white border-white/0`
            : tw`border-white/10`,
        ]}
        onPress={() => onSelect(null)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            tw`font-mont-semibold text-sm`,
            selectedCategory === null ? tw`text-black` : tw`text-white/60`,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Category filters */}
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            tw`px-4 py-1 rounded-md border`,
            selectedCategory === category
              ? tw`bg-white border-white/0`
              : tw` border-white/10`,
          ]}
          onPress={() => onSelect(category)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              tw`font-mont-semibold text-sm`,
              selectedCategory === category
                ? tw`text-black`
                : tw`text-white/60`,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
