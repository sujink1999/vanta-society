import { apiClient } from './client';
import {
  ApiResponse,
  GoogleSignInRequest,
  AppleSignInRequest,
  AuthResponse,
  EmailSignUpRequest,
  EmailSignUpResponse,
  VerifyEmailRequest,
  EmailSignInRequest,
  EmailSignInResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationRequest
} from './types';

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

// POST /auth/apple-signin
export async function appleSignIn(request: AppleSignInRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/apple-signin',
    request
  );

  // Store the JWT token automatically
  if (response.success && response.data.token) {
    await apiClient.setToken(response.data.token);
  }

  return response;
}

// POST /auth/email-signup
export async function emailSignUp(request: EmailSignUpRequest): Promise<ApiResponse<EmailSignUpResponse>> {
  const response = await apiClient.post<ApiResponse<EmailSignUpResponse>>(
    '/auth/email-signup',
    request
  );
  return response;
}

// POST /auth/verify-email
export async function verifyEmail(request: VerifyEmailRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/verify-email',
    request
  );

  // Store the JWT token automatically
  if (response.success && response.data.token) {
    await apiClient.setToken(response.data.token);
  }

  return response;
}

// POST /auth/email-signin
export async function emailSignIn(request: EmailSignInRequest): Promise<ApiResponse<EmailSignInResponse | any>> {
  const response = await apiClient.post<ApiResponse<EmailSignInResponse | any>>(
    '/auth/email-signin',
    request
  );

  // Store the JWT token automatically (only if not requiring verification)
  if (response.success && response.data?.token && !response.data?.requiresVerification) {
    await apiClient.setToken(response.data.token);
  }

  return response;
}

// POST /auth/forgot-password
export async function forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/forgot-password',
    request
  );
  return response;
}

// POST /auth/reset-password
export async function resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/reset-password',
    request
  );
  return response;
}

// POST /auth/resend-verification
export async function resendVerification(request: ResendVerificationRequest): Promise<ApiResponse<{ message: string }>> {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    '/auth/resend-verification',
    request
  );
  return response;
}

// Clear stored JWT token
export async function signOut(): Promise<void> {
  await apiClient.clearToken();
}