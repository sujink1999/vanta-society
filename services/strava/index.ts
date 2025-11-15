/**
 * Strava Integration Service
 * Main export point for Strava authentication and API services
 */

import { StravaAuthService } from "./StravaAuthService";

export { StravaAPIService } from "./StravaAPIService";
export { StravaAuthService } from "./StravaAuthService";
export * from "./types";

// Strava OAuth configuration
// TODO: Replace with your actual Strava API credentials
// Get them from: https://www.strava.com/settings/api
export const STRAVA_CLIENT_ID =
  process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || "168255";
export const STRAVA_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET ||
  "a87597d36b7c74fe5c0d5acc41b293e01afa10e8";

// Create singleton auth service instance
export const stravaAuth = new StravaAuthService(
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET
);
