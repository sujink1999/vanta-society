import tw from "@/constants/tw";
import { BookSummary } from "@/services/api/books";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface BookCardProps {
  book: BookSummary;
  onPress: () => void;
  width: number;
}

export function BookCard({ book, onPress, width }: BookCardProps) {
  return (
    <TouchableOpacity
      style={[
        tw`bg-white/5 border border-white/5 rounded-md overflow-hidden pt-3`,
        { width },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Book Cover */}
      <Image
        source={{ uri: book.imageUrl }}
        // style={tw`w-full aspect-[2/3]`}
        style={tw`w-full h-20`}
        resizeMode="contain"
      />

      {/* Book Info */}
      <View style={tw`p-3`}>
        <Text
          style={tw`text-white font-tussi-bold text-xs mb-1 text-center`}
          numberOfLines={2}
        >
          {book.title}
        </Text>
        <Text
          style={tw`text-white/60 font-mont text-xs mb-2 text-center`}
          numberOfLines={1}
        >
          {book.author}
        </Text>

        {/* Rating */}
        {book.reviewScore && (
          <View style={tw`flex-row items-center gap-1 justify-center`}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={tw`text-white/80 font-mont text-xs`}>
              {book.reviewScore.toFixed(1)}
            </Text>
            {book.reviewerCount && (
              <Text style={tw`text-white/40 font-mont text-xs text-center`}>
                ({book.reviewerCount.toLocaleString()})
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
