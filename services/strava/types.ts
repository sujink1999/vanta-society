/**
 * Strava API Types
 * Based on Strava API v3 documentation: https://developers.strava.com/docs/reference/
 */

export interface StravaAthlete {
  id: number;
  username: string | null;
  firstname: string;
  lastname: string;
  profile_medium: string | null;
  profile: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sex: "M" | "F" | null;
  created_at: string;
  updated_at: string;
}

export interface StravaTokenResponse {
  token_type: "Bearer";
  expires_at: number; // Unix timestamp
  expires_in: number; // Seconds
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: StravaActivityType;
  sport_type: StravaSportType;
  start_date: string; // ISO 8601
  start_date_local: string; // ISO 8601
  timezone: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  average_speed: number; // meters/second
  max_speed: number; // meters/second
  average_cadence?: number;
  average_temp?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
  elev_high?: number;
  elev_low?: number;
}

export type StravaActivityType =
  | "AlpineSki"
  | "BackcountrySki"
  | "Canoeing"
  | "Crossfit"
  | "EBikeRide"
  | "Elliptical"
  | "Golf"
  | "Handcycle"
  | "Hike"
  | "IceSkate"
  | "InlineSkate"
  | "Kayaking"
  | "Kitesurf"
  | "NordicSki"
  | "Ride"
  | "RockClimbing"
  | "RollerSki"
  | "Rowing"
  | "Run"
  | "Sail"
  | "Skateboard"
  | "Snowboard"
  | "Snowshoe"
  | "Soccer"
  | "StairStepper"
  | "StandUpPaddling"
  | "Surfing"
  | "Swim"
  | "Velomobile"
  | "VirtualRide"
  | "VirtualRun"
  | "Walk"
  | "WeightTraining"
  | "Wheelchair"
  | "Windsurf"
  | "Workout"
  | "Yoga";

export type StravaSportType =
  | "AlpineSki"
  | "BackcountrySki"
  | "Badminton"
  | "Canoeing"
  | "Crossfit"
  | "EBikeRide"
  | "Elliptical"
  | "EMountainBikeRide"
  | "Golf"
  | "GravelRide"
  | "Handcycle"
  | "HighIntensityIntervalTraining"
  | "Hike"
  | "IceSkate"
  | "InlineSkate"
  | "Kayaking"
  | "Kitesurf"
  | "MountainBikeRide"
  | "NordicSki"
  | "Pickleball"
  | "Pilates"
  | "Racquetball"
  | "Ride"
  | "RockClimbing"
  | "RollerSki"
  | "Rowing"
  | "Run"
  | "Sail"
  | "Skateboard"
  | "Snowboard"
  | "Snowshoe"
  | "Soccer"
  | "Squash"
  | "StairStepper"
  | "StandUpPaddling"
  | "Surfing"
  | "Swim"
  | "TableTennis"
  | "Tennis"
  | "TrailRun"
  | "Velomobile"
  | "VirtualRide"
  | "VirtualRow"
  | "VirtualRun"
  | "Walk"
  | "WeightTraining"
  | "Wheelchair"
  | "Windsurf"
  | "Workout"
  | "Yoga";

export interface StravaStats {
  recent_run_totals: StravaActivityTotal;
  recent_ride_totals: StravaActivityTotal;
  recent_swim_totals: StravaActivityTotal;
  ytd_run_totals: StravaActivityTotal;
  ytd_ride_totals: StravaActivityTotal;
  ytd_swim_totals: StravaActivityTotal;
  all_run_totals: StravaActivityTotal;
  all_ride_totals: StravaActivityTotal;
  all_swim_totals: StravaActivityTotal;
}

export interface StravaActivityTotal {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
  achievement_count?: number;
}

/**
 * Normalized workout data for Vanta Society app
 */
export interface WorkoutData {
  id: string;
  name: string;
  type:
    | "run"
    | "ride"
    | "swim"
    | "workout"
    | "hike"
    | "walk"
    | "yoga"
    | "other";
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
    average?: number; // meters/second
    max?: number; // meters/second
  };
  source: "strava";
}
