import { apiClient } from "./client";

// Types
export interface BookSection {
  title: string;
  content: string;
}

export interface BookSummary {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  about: string; // Truncated to 200 chars in list
  categories: string[];
  reviewScore?: number;
  reviewerCount?: number;
  publishYear?: number;
}

export interface Book extends BookSummary {
  aboutAuthor?: string;
  learningPoints: string[];
  sections: BookSection[];
  isbn?: string;
  priority?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  success: boolean;
  data: {
    books: BookSummary[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
  message: string;
}

export interface BookResponse {
  success: boolean;
  data: Book;
  message: string;
}

// API Functions

/**
 * Get all books (fetches up to 100 books in one call)
 */
export async function getBooks(): Promise<BookSummary[]> {
  const response = await apiClient.get<BooksResponse>("/books", {
    params: {
      limit: 100,
      sort: "priority",
      order: "desc",
    },
  });
  return response.data.books;
}

/**
 * Get a single book by ID with full details
 */
export async function getBookById(id: number): Promise<Book> {
  const response = await apiClient.get<BookResponse>(`/books/${id}`);
  return response.data;
}

/**
 * Extract unique categories from books array
 */
export function extractCategories(books: BookSummary[]): string[] {
  const categoriesSet = new Set<string>();
  books.forEach((book) => {
    book.categories?.forEach((category) => categoriesSet.add(category));
  });
  return Array.from(categoriesSet).sort();
}
