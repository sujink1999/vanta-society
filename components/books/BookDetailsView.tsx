import { Button } from "@/components/Button";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { Book } from "@/services/api/books";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BookDetailsViewProps {
  book: Book;
  onBack: () => void;
  onStartReading: () => void;
}

export function BookDetailsView({
  book,
  onBack,
  onStartReading,
}: BookDetailsViewProps) {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={tw`px-3 pt-3 pb-4 flex-row items-center gap-3`}>
          <TouchableOpacity
            onPress={onBack}
            style={tw`p-2 bg-white/5 border border-white/5 rounded-md`}
          >
            <ChevronLeftIcon size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Book Info */}
        <View style={tw`px-3 mb-6`}>
          <View style={tw`flex-row items-start gap-2 `}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white font-tussi text-lg mb-1`}>
                {book.title}
              </Text>
              <Text style={tw`text-white/80 font-mont text-base`}>
                {book.author}
              </Text>
            </View>
            <Image
              source={{ uri: book.imageUrl }}
              style={tw`w-14 h-20 rounded-md`}
              resizeMode="contain"
            />
          </View>

          {/* Rating */}
          {book.reviewScore && (
            <View style={tw`flex-row items-center gap-2 mb-2`}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={tw`text-white/80 font-mont text-sm`}>
                {book.reviewScore.toFixed(1)}
              </Text>
              {book.reviewerCount && (
                <Text style={tw`text-white/40 font-mont text-sm`}>
                  ({book.reviewerCount.toLocaleString()} reviews)
                </Text>
              )}
            </View>
          )}

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
              {book.categories.map((category) => (
                <View
                  key={category}
                  style={tw`bg-white/10 px-3 py-1 rounded-full`}
                >
                  <Text style={tw`text-white/60 font-mont text-xs`}>
                    {category}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* About Book */}
        <View style={tw`px-3 mb-8`}>
          <Text style={tw`text-white font-tussi text-base mb-3`}>
            Why Read This Book
          </Text>
          <Text style={tw`text-white/70 font-mont text-sm leading-6`}>
            {book.about}
          </Text>
        </View>

        {/* Learning Points */}
        {book.learningPoints && book.learningPoints.length > 0 && (
          <View style={tw`px-3 mb-8`}>
            <Text style={tw`text-white font-tussi text-base mb-3`}>
              Key Takeaways
            </Text>
            {book.learningPoints.map((point, index) => (
              <View key={index} style={tw`flex-row mb-2`}>
                <Text style={tw`text-primary font-mont-bold text-sm mr-2`}>
                  •
                </Text>
                <Text
                  style={tw`text-white/70 font-mont text-sm leading-6 flex-1`}
                >
                  {point}
                </Text>
              </View>
            ))}
          </View>
        )}
        {/* About Author */}
        {book.aboutAuthor && (
          <View style={tw`px-3 mb-6`}>
            <Text style={tw`text-white font-tussi text-base mb-3`}>
              About the Author
            </Text>
            <Text style={tw`text-white/70 font-mont text-sm leading-6`}>
              {book.aboutAuthor}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Start Reading Button */}
      <View style={tw`px-3 pb-6  border-t border-white/10`}>
        <Button title="Start Reading" onPress={onStartReading} />
      </View>
    </SafeAreaView>
  );
}
