import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "./types";

// Storage keys
const TOKEN_KEY = "vanta_jwt_token";

// Base URL - you can change this to your backend URL
const BASE_URL = "http://localhost:8080/api"; // Update this to your backend URL

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - automatically add JWT token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await this.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Failed to get token from storage:", error);
        }

        // Log request in development
        if (__DEV__) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        if (__DEV__) {
          console.error("❌ Request interceptor error:", error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle responses and errors
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          console.log(
            `✅ ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        // Log error in development
        if (__DEV__) {
          console.error(
            `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message,
            }
          );
        }

        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear stored token
          await this.clearToken();

          // You can emit an event here to redirect to login
          // EventEmitter.emit('unauthorized');
        }

        // Transform error to our ApiError format
        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.error || error.message || "Network error",
          status: error.response?.status,
          code: error.code,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Token management methods
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to get token from storage:", error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to save token to storage:", error);
    }
  }

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to clear token from storage:", error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // Get the axios instance for direct use if needed
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
