import { ChevronLeftIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { Book } from "@/services/api/books";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface BookSectionsViewProps {
  book: Book;
  onBack: () => void;
}

export function BookSectionsView({ book, onBack }: BookSectionsViewProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Reset scroll state when section changes
  useEffect(() => {
    setHasScrolledToBottom(false);
  }, [currentSectionIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < book.sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentSectionIndex(nextIndex);
    } else {
      // On final section, mark as read and go back
      onBack();
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      const prevIndex = currentSectionIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      setCurrentSectionIndex(prevIndex);
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSectionIndex(index);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      {/* Header */}
      <View style={tw`px-3 pt-3 pb-4 flex-row items-center justify-between`}>
        <TouchableOpacity
          onPress={onBack}
          style={tw`p-2 bg-white/5 border border-white/5 rounded-md`}
        >
          <ChevronLeftIcon size={20} color="white" />
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-white/60 font-mont text-xs`}>
            Section {currentSectionIndex + 1} of {book.sections.length}
          </Text>
        </View>

        {/* Placeholder for alignment */}
        <View style={tw`w-10`} />
      </View>

      {/* Sections FlatList */}
      <FlatList
        ref={flatListRef}
        data={book.sections}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(_, index) => `section-${index}`}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView
              style={tw`flex-1 px-3`}
              contentContainerStyle={tw`pb-6`}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {/* Section Title */}
              <Text style={tw`text-white font-tussi text-base mb-4`}>
                {item.title}
              </Text>

              {/* Section Content */}
              <Text style={tw`text-white/80 font-mont text-sm leading-7`}>
                {item.content}
              </Text>
            </ScrollView>
          </View>
        )}
      />

      {/* Navigation Controls */}
      <View
        style={tw`px-3 pb-6 pt-3 border-t border-white/10 flex-row items-center justify-between`}
      >
        {/* Previous Button */}
        <TouchableOpacity
          onPress={goToPreviousSection}
          disabled={currentSectionIndex === 0}
          style={[
            tw`flex-row items-center gap-2 px-2 py-2 rounded-md`,
            currentSectionIndex === 0
              ? tw`bg-white/5`
              : tw`bg-white/10 border border-white/10`,
          ]}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentSectionIndex === 0 ? "#666666" : "white"}
          />
        </TouchableOpacity>

        {/* Next Button / Mark as Read */}
        <TouchableOpacity
          onPress={goToNextSection}
          disabled={!hasScrolledToBottom}
          style={[
            tw`flex-row items-center gap-2 px-2 py-2 rounded-md`,
            hasScrolledToBottom ? tw`bg-primary` : tw`bg-white/5`,
          ]}
        >
          {currentSectionIndex === book.sections.length - 1 ? (
            <Text
              style={[
                tw`font-tussi-bold text-xs px-1`,
                hasScrolledToBottom ? tw`text-white` : tw`text-white/30`,
              ]}
            >
              Mark as read
            </Text>
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={hasScrolledToBottom ? "white" : "#666666"}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
