import { BookCard } from "@/components/BookCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { BookSummary } from "@/services/api/books";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BookListViewProps {
  books: BookSummary[];
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onBookPress: (bookId: number) => void;
  cardWidth: number;
  error?: string | null;
  onRetry?: () => void;
}

export function BookListView({
  books,
  categories,
  selectedCategory,
  onCategorySelect,
  onBookPress,
  cardWidth,
  error,
  onRetry,
}: BookListViewProps) {
  const filteredBooks = selectedCategory
    ? books.filter((book) => book.categories?.includes(selectedCategory))
    : books;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Header */}
      <View style={tw`px-3 pt-3 pb-4 flex-row items-start gap-3 relative`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 bg-white/5 border border-white/5 rounded-md absolute top-3 left-3`}
        >
          <ChevronLeftIcon size={20} color="white" />
        </TouchableOpacity>
        <View style={tw`flex-1  items-center gap-2 px-6 mt-4`}>
          <Text style={tw`text-white font-tussi-bold text-xl text-center`}>
            BOOKS
          </Text>
          <Text style={tw`text-white/60 font-mont text-xs text-center`}>
            Learn key insights from curated books in bite-sized summaries
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <View style={tw`mb-4 mt-4`}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={onCategorySelect}
          />
        </View>
      )}

      {/* Content */}
      {error ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Text style={tw`text-white/60 font-mont text-center mb-4`}>
            {error}
          </Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              style={tw`bg-primary px-6 py-3 rounded-md`}
            >
              <Text style={tw`text-white font-mont-semibold`}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-3 pb-6`} showsVerticalScrollIndicator={false}>
          <View style={tw`flex-row flex-wrap gap-3 mt-4`}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPress={() => onBookPress(book.id)}
                width={cardWidth}
              />
            ))}
          </View>

          {filteredBooks.length === 0 && (
            <View style={tw`items-center justify-center py-12`}>
              <Text style={tw`text-white/60 font-mont text-center`}>
                No books found in this category
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
