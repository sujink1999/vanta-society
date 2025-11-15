import moment from "moment";
import {
  StravaActivity,
  StravaActivityType,
  StravaAthlete,
  StravaStats,
  WorkoutData,
} from "./types";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";

/**
 * Strava API Service
 * Handles all Strava API calls for activities, athlete data, and stats
 */
export class StravaAPIService {
  /**
   * Get athlete profile
   */
  static async getAthlete(accessToken: string): Promise<StravaAthlete> {
    const response = await fetch(`${STRAVA_API_BASE}/athlete`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch athlete: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get athlete stats
   */
  static async getAthleteStats(
    accessToken: string,
    athleteId: number
  ): Promise<StravaStats> {
    const response = await fetch(
      `${STRAVA_API_BASE}/athletes/${athleteId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get athlete activities
   * @param accessToken Strava access token
   * @param options Query options
   */
  static async getActivities(
    accessToken: string,
    options?: {
      before?: Date; // Unix timestamp
      after?: Date; // Unix timestamp
      page?: number;
      perPage?: number; // Max 200
    }
  ): Promise<StravaActivity[]> {
    const params = new URLSearchParams();

    if (options?.before) {
      params.append("before", Math.floor(options.before.getTime() / 1000).toString());
    }
    if (options?.after) {
      params.append("after", Math.floor(options.after.getTime() / 1000).toString());
    }
    if (options?.page) {
      params.append("page", options.page.toString());
    }
    if (options?.perPage) {
      params.append("per_page", Math.min(options.perPage, 200).toString());
    }

    const url = `${STRAVA_API_BASE}/athlete/activities?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get a single activity by ID with full details
   */
  static async getActivity(
    accessToken: string,
    activityId: number
  ): Promise<StravaActivity> {
    const response = await fetch(`${STRAVA_API_BASE}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch activity: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Convert Strava activity to normalized WorkoutData format
   */
  static normalizeActivity(activity: StravaActivity): WorkoutData {
    const startDate = moment(activity.start_date).toDate();
    const endDate = moment(activity.start_date)
      .add(activity.elapsed_time, "seconds")
      .toDate();

    return {
      id: `strava-${activity.id}`,
      name: activity.name,
      type: this.mapActivityType(activity.type),
      startDate,
      endDate,
      duration: activity.elapsed_time,
      distance: activity.distance,
      calories: activity.calories,
      heartRate: activity.has_heartrate
        ? {
            average: activity.average_heartrate,
            max: activity.max_heartrate,
          }
        : undefined,
      elevation: activity.total_elevation_gain,
      speed: {
        average: activity.average_speed,
        max: activity.max_speed,
      },
      source: "strava",
    };
  }

  /**
   * Map Strava activity type to normalized workout type
   */
  private static mapActivityType(
    type: StravaActivityType
  ): WorkoutData["type"] {
    const typeMap: Record<StravaActivityType, WorkoutData["type"]> = {
      Run: "run",
      VirtualRun: "run",
      Ride: "ride",
      VirtualRide: "ride",
      EBikeRide: "ride",
      Swim: "swim",
      Hike: "hike",
      Walk: "walk",
      Yoga: "yoga",
      WeightTraining: "workout",
      Workout: "workout",
      Crossfit: "workout",
      AlpineSki: "other",
      BackcountrySki: "other",
      Canoeing: "other",
      Elliptical: "workout",
      Golf: "other",
      Handcycle: "ride",
      IceSkate: "other",
      InlineSkate: "other",
      Kayaking: "other",
      Kitesurf: "other",
      NordicSki: "other",
      RockClimbing: "workout",
      RollerSki: "other",
      Rowing: "workout",
      Sail: "other",
      Skateboard: "other",
      Snowboard: "other",
      Snowshoe: "other",
      Soccer: "workout",
      StairStepper: "workout",
      StandUpPaddling: "other",
      Surfing: "other",
      Velomobile: "ride",
      Wheelchair: "other",
      Windsurf: "other",
    };

    return typeMap[type] || "other";
  }

  /**
   * Get recent activities and normalize them
   */
  static async getRecentWorkouts(
    accessToken: string,
    days: number = 30
  ): Promise<WorkoutData[]> {
    const after = moment().subtract(days, "days").toDate();

    const activities = await this.getActivities(accessToken, {
      after,
      perPage: 200,
    });

    return activities.map((activity) => this.normalizeActivity(activity));
  }
}
