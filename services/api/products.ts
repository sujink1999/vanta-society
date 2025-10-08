import apiClient from "./client";
import {
  ApiResponse,
  Product,
  ProductListResponse,
  ProductNotification,
  StoreQueryParams,
} from "./types";

/**
 * Get all products (coming soon items)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns List of products with pagination metadata
 */
export async function getProducts(
  params?: StoreQueryParams
): Promise<ProductListResponse> {
  const response = await apiClient.get<ApiResponse<ProductListResponse>>(
    "/products",
    params
  );
  return response.data;
}

/**
 * Get a single product by ID
 * @param id - Product ID
 * @returns Product details
 */
export async function getProduct(id: number): Promise<Product> {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/products/${id}`
  );
  return response.data;
}

/**
 * Request notification when a product becomes available
 * @param productId - Product ID
 */
export async function requestProductNotification(
  productId: number
): Promise<void> {
  await apiClient.post<ApiResponse<void>>(`/products/${productId}/notify`);
}

/**
 * Cancel notification request for a product
 * @param productId - Product ID
 */
export async function cancelProductNotification(
  productId: number
): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(`/products/${productId}/notify`);
}

/**
 * Get user's product notification requests
 * @returns List of products user has requested notifications for
 */
export async function getUserProductNotifications(): Promise<
  ProductNotification[]
> {
  const response = await apiClient.get<ApiResponse<ProductNotification[]>>(
    "/products/notifications"
  );
  return response.data;
}
