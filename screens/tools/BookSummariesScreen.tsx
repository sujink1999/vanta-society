import {
  BookDetailsView,
  BookListView,
  BookSectionsView,
} from "@/components/books";
import { PulsingView } from "@/components/PulsingView";
import tw from "@/constants/tw";
import {
  Book,
  BookSummary,
  extractCategories,
  getBookById,
  getBooks,
} from "@/services/api/books";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 12; // px-3
const GAP = 12; // gap-3
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / 2;

type ViewState = "list" | "sections" | "details";

export default function BookSummariesScreen() {
  // List state
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected book state
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loadingBookSummary, setLoadingBookSummary] =
    useState<BookSummary | null>(null);
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBooks = await getBooks();
      setBooks(fetchedBooks);
      setCategories(extractCategories(fetchedBooks));
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = async (bookId: number) => {
    try {
      // Store the book summary for loading display
      const bookSummary = books.find((b) => b.id === bookId);
      setLoadingBookSummary(bookSummary || null);
      setBookLoading(true);
      const book = await getBookById(bookId);
      setSelectedBook(book);
      setViewState("details");
    } catch (err) {
      console.error("Error fetching book:", err);
      setError("Failed to load book. Please try again.");
    } finally {
      setBookLoading(false);
      setLoadingBookSummary(null);
    }
  };

  const handleBackToList = () => {
    setSelectedBook(null);
    setViewState("list");
  };

  const handleStartReading = () => {
    setViewState("sections");
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <PulsingView>
            <Ionicons name="library" size={40} color="white" />
          </PulsingView>
        </View>
      </SafeAreaView>
    );
  }

  // Book loading state
  if (bookLoading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-black`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <PulsingView>
            <Ionicons name="library" size={40} color="white" />
          </PulsingView>
          {loadingBookSummary && (
            <Text style={tw`text-white/60 font-mont text-sm mt-4 text-center`}>
              Fetching{" "}
              <Text style={tw`text-white `}>{loadingBookSummary.title}</Text>
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Sections view
  if (viewState === "sections" && selectedBook) {
    return <BookSectionsView book={selectedBook} onBack={handleBackToList} />;
  }

  // Details view
  if (viewState === "details" && selectedBook) {
    return (
      <BookDetailsView
        book={selectedBook}
        onBack={handleBackToList}
        onStartReading={handleStartReading}
      />
    );
  }

  // List view (default)
  return (
    <BookListView
      books={books}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
      onBookPress={handleBookPress}
      cardWidth={CARD_WIDTH}
      error={error}
      onRetry={fetchBooks}
    />
  );
}
