import { WorkoutSession } from "@/services/api/types";
import { WorkoutData } from "./types";

/**
 * Convert Strava WorkoutData to WorkoutSession format
 */
export function convertStravaToWorkoutSession(
  workout: WorkoutData
): WorkoutSession {
  const now = new Date().toISOString();

  // Extract Strava activity ID from "strava-{id}" format
  const stravaId = parseInt(workout.id.replace("strava-", ""), 10);

  // Convert duration from seconds to minutes
  const durationMinutes = Math.round(workout.duration / 60);

  // Map Strava type to WorkoutSession type and subtypes
  const { type, cardioType, flexibilityType } = mapStravaType(workout.type);

  // Calculate pace if we have distance and speed
  const pace = calculatePace(workout.speed?.average, workout.distance);

  const session: WorkoutSession = {
    id: workout.id, // Keep "strava-{id}" format
    date: workout.startDate.toISOString(),
    type,
    name: workout.name, // Use name from Strava
    duration: durationMinutes,
    source: "strava",
    stravaId,
    createdAt: now,
    updatedAt: now,
  };

  // Add cardio-specific fields
  if (type === "cardio") {
    session.cardioType = cardioType;
    if (workout.distance) {
      session.distance = workout.distance / 1000; // Convert meters to km
      session.distanceUnit = "km";
    }
    if (pace) {
      session.pace = pace;
    }
  }

  // Add flexibility-specific fields
  if (type === "flexibility") {
    session.flexibilityType = flexibilityType;
  }

  // Add notes with Strava-specific data
  const notes: string[] = [];
  if (workout.calories) {
    notes.push(`${workout.calories} calories`);
  }
  if (workout.heartRate?.average) {
    notes.push(`Avg HR: ${Math.round(workout.heartRate.average)} bpm`);
  }
  if (workout.elevation && workout.elevation > 0) {
    notes.push(`Elevation: ${Math.round(workout.elevation)}m`);
  }
  if (notes.length > 0) {
    session.notes = notes.join(" • ");
  }

  return session;
}

/**
 * Map Strava activity type to WorkoutSession type system
 */
function mapStravaType(stravaType: WorkoutData["type"]): {
  type: "strength" | "cardio" | "flexibility" | "sports";
  cardioType?: "running" | "cycling" | "swimming" | "rowing" | "other";
  flexibilityType?: "yoga" | "stretching" | "mobility";
} {
  switch (stravaType) {
    case "run":
      return { type: "cardio", cardioType: "running" };
    case "ride":
      return { type: "cardio", cardioType: "cycling" };
    case "swim":
      return { type: "cardio", cardioType: "swimming" };
    case "yoga":
      return { type: "flexibility", flexibilityType: "yoga" };
    case "workout":
    case "hike":
    case "walk":
    case "other":
    default:
      return { type: "cardio", cardioType: "other" };
  }
}

/**
 * Calculate pace in min/km format from speed (m/s)
 */
function calculatePace(
  speedMetersPerSecond?: number,
  distance?: number
): string | undefined {
  if (!speedMetersPerSecond || !distance || distance === 0) {
    return undefined;
  }

  // Convert m/s to min/km
  const secondsPerKm = 1000 / speedMetersPerSecond;
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
