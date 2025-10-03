import { apiClient } from './client';
import { ApiResponse, GoogleSignInRequest, AuthResponse } from './types';

// POST /auth/google-signin
export async function googleSignIn(request: GoogleSignInRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/google-signin',
    request
  );

  // Store the JWT token automatically
  if (response.success && response.data.token) {
    await apiClient.setToken(response.data.token);
  }

  return response;
}

// Clear stored JWT token
export async function signOut(): Promise<void> {
  await apiClient.clearToken();
}