# Strava Integration Guide

## Overview
This integration allows Vanta Society users to connect their Strava accounts and sync workout/run data.

## Architecture

### Services (`/services/strava/`)
- **StravaAuthService** - Handles OAuth flow, token management, and secure storage
- **StravaAPIService** - Fetches activities and athlete data from Strava API
- **types.ts** - TypeScript interfaces for Strava data

### Components (`/components/strava/`)
- **StravaConnect** - Connection UI with OAuth flow
- **StravaWorkouts** - Display list of recent workouts

## Setup

### 1. Strava API Credentials
Your credentials are already configured in `/services/strava/index.ts`:
- Client ID: `168255`
- Client Secret: `a87597d36b7c74fe5c0d5acc41b293e01afa10e8`

### 2. Configure OAuth Redirect URI
In your Strava app settings (https://www.strava.com/settings/api), add:
- Production: `vantasociety://`
- Development: `exp://localhost:8081` (or your dev server)

### 3. Rebuild App
Since we added `expo-secure-store` plugin:
```bash
npx expo prebuild --clean
eas build --profile development --platform all
```

## Usage

### Connect to Strava
```tsx
import { StravaConnect } from "@/components/strava/StravaConnect";

<StravaConnect
  onConnectionChange={(connected) => {
    console.log("Strava connected:", connected);
  }}
/>
```

### Display Workouts
```tsx
import { StravaWorkouts } from "@/components/strava/StravaWorkouts";

<StravaWorkouts days={30} />
```

### Using the API Directly
```tsx
import { stravaAuth, StravaAPIService } from "@/services/strava";

// Check connection
const connected = await stravaAuth.isConnected();

// Get access token
const token = await stravaAuth.getValidAccessToken();

// Fetch recent workouts
const workouts = await StravaAPIService.getRecentWorkouts(token, 30);

// Get athlete info
const athlete = await StravaAPIService.getAthlete(token);

// Disconnect
await stravaAuth.disconnect();
```

## Data Format

### WorkoutData (Normalized)
```typescript
{
  id: string;
  name: string;
  type: "run" | "ride" | "swim" | "workout" | "hike" | "walk" | "yoga" | "other";
  startDate: Date;
  endDate: Date;
  duration: number; // seconds
  distance?: number; // meters
  calories?: number;
  heartRate?: {
    average?: number;
    max?: number;
  };
  elevation?: number; // meters
  speed?: {
    average?: number; // m/s
    max?: number; // m/s
  };
  source: "strava";
}
```

## Features
- ✅ OAuth 2.0 authentication
- ✅ Automatic token refresh
- ✅ Secure token storage (expo-secure-store)
- ✅ Pull-to-refresh workouts
- ✅ Normalized data format
- ✅ Cross-platform (iOS & Android)
- ✅ Disconnect/revoke access

## Integration Points

### Settings Screen
Add Strava connection to your settings or profile screen.

### Winter Arc Stats
You can integrate Strava workout data into Winter Arc scoring:

```tsx
import { stravaAuth, StravaAPIService } from "@/services/strava";

const fetchStravaWorkouts = async () => {
  const token = await stravaAuth.getValidAccessToken();
  if (!token) return [];

  const workouts = await StravaAPIService.getRecentWorkouts(token, 7);
  return workouts;
};

// Use in Winter Arc calculations
const stravaWorkouts = await fetchStravaWorkouts();
const totalCalories = stravaWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
```

## OAuth Flow
1. User taps "Connect with Strava"
2. App opens Strava OAuth in browser
3. User authorizes app
4. Strava redirects back to `vantasociety://`
5. App exchanges code for access token
6. Token stored securely in expo-secure-store
7. Token auto-refreshes when needed

## Rate Limits
Strava API limits:
- 200 requests per 15 minutes
- 2000 requests per day (free tier)

## Security
- Tokens stored in expo-secure-store (encrypted)
- Automatic token refresh
- Clean disconnect/revoke functionality
