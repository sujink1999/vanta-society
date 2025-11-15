import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { StravaTokenResponse } from "./types";

// Complete auth session for mobile
WebBrowser.maybeCompleteAuthSession();

// Storage keys
const STRAVA_ACCESS_TOKEN_KEY = "strava_access_token";
const STRAVA_REFRESH_TOKEN_KEY = "strava_refresh_token";
const STRAVA_EXPIRES_AT_KEY = "strava_expires_at";
const STRAVA_ATHLETE_KEY = "strava_athlete";

// Strava OAuth endpoints
const STRAVA_DISCOVERY = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

/**
 * Strava Authentication Service
 * Handles OAuth flow, token management, and secure storage
 */
export class StravaAuthService {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Get OAuth configuration for use with useAuthRequest hook
   */
  getAuthConfig() {
    // For development, makeRedirectUri generates something like exp://192.168.x.x:8081
    // You need to add that IP address to Strava's Authorization Callback Domain
    // For production builds, it will use the custom scheme (vantasociety)
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "vantasociety",
      path: "redirect",
    });

    console.log("=== STRAVA REDIRECT URI ===");
    console.log("Add this to Strava Authorization Callback Domain:", redirectUri);
    console.log("===========================");

    return {
      config: {
        clientId: this.clientId,
        scopes: ["activity:read"],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: false, // Strava doesn't use PKCE
        extraParams: {
          approval_prompt: "force",
        },
      },
      discovery: STRAVA_DISCOVERY,
    };
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
    const response = await fetch(STRAVA_DISCOVERY.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${JSON.stringify(error)}`);
    }

    const tokenResponse: StravaTokenResponse = await response.json();
    await this.saveTokens(tokenResponse);
    return tokenResponse;
  }

  /**
   * Save tokens and athlete data to secure storage
   */
  private async saveTokens(tokenResponse: StravaTokenResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(
        STRAVA_ACCESS_TOKEN_KEY,
        tokenResponse.access_token
      ),
      SecureStore.setItemAsync(
        STRAVA_REFRESH_TOKEN_KEY,
        tokenResponse.refresh_token
      ),
      SecureStore.setItemAsync(
        STRAVA_EXPIRES_AT_KEY,
        tokenResponse.expires_at.toString()
      ),
      SecureStore.setItemAsync(
        STRAVA_ATHLETE_KEY,
        JSON.stringify(tokenResponse.athlete)
      ),
    ]);
  }

  /**
   * Get valid access token (refreshes if expired)
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = await SecureStore.getItemAsync(STRAVA_ACCESS_TOKEN_KEY);
    const expiresAtStr = await SecureStore.getItemAsync(STRAVA_EXPIRES_AT_KEY);

    if (!accessToken || !expiresAtStr) {
      return null;
    }

    const expiresAt = parseInt(expiresAtStr, 10);
    const now = Math.floor(Date.now() / 1000);

    // If token expires in less than 5 minutes, refresh it
    if (now >= expiresAt - 300) {
      return await this.refreshAccessToken();
    }

    return accessToken;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await SecureStore.getItemAsync(
      STRAVA_REFRESH_TOKEN_KEY
    );

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(STRAVA_DISCOVERY.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const tokenResponse: StravaTokenResponse = await response.json();
      await this.saveTokens(tokenResponse);
      return tokenResponse.access_token;
    } catch (error) {
      console.error("Error refreshing Strava token:", error);
      // Clear invalid tokens
      await this.disconnect();
      return null;
    }
  }

  /**
   * Check if user is connected to Strava
   */
  async isConnected(): Promise<boolean> {
    const accessToken = await this.getValidAccessToken();
    return accessToken !== null;
  }

  /**
   * Get stored athlete data
   */
  async getAthlete() {
    const athleteStr = await SecureStore.getItemAsync(STRAVA_ATHLETE_KEY);
    if (!athleteStr) return null;

    try {
      return JSON.parse(athleteStr);
    } catch {
      return null;
    }
  }

  /**
   * Disconnect from Strava (revoke access and clear tokens)
   */
  async disconnect(): Promise<void> {
    try {
      const accessToken = await SecureStore.getItemAsync(
        STRAVA_ACCESS_TOKEN_KEY
      );

      if (accessToken) {
        // Revoke access on Strava
        await fetch(STRAVA_DISCOVERY.revocationEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });
      }
    } catch (error) {
      console.error("Error revoking Strava access:", error);
    } finally {
      // Clear all stored tokens
      await Promise.all([
        SecureStore.deleteItemAsync(STRAVA_ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(STRAVA_REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(STRAVA_EXPIRES_AT_KEY),
        SecureStore.deleteItemAsync(STRAVA_ATHLETE_KEY),
      ]);
    }
  }
}
