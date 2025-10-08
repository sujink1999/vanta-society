import apiClient from "./client";
import {
  ApiResponse,
  MarketplaceItem,
  MarketplaceListResponse,
  StoreQueryParams,
} from "./types";

/**
 * Get all marketplace brands
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns List of marketplace brands with pagination metadata
 */
export async function getMarketplaceBrands(
  params?: StoreQueryParams
): Promise<MarketplaceListResponse> {
  const response = await apiClient.get<ApiResponse<MarketplaceListResponse>>(
    "/marketplace",
    params
  );
  return response.data;
}

/**
 * Get a single marketplace brand by ID
 * @param id - Marketplace brand ID
 * @returns Marketplace brand details
 */
export async function getMarketplaceBrand(
  id: number
): Promise<MarketplaceItem> {
  const response = await apiClient.get<ApiResponse<MarketplaceItem>>(
    `/marketplace/${id}`
  );
  return response.data;
}
