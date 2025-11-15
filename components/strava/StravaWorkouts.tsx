import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { WorkoutData } from "@/services/strava";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

interface StravaWorkoutsProps {
  days?: number; // Number of days to fetch (default 30)
}

export function StravaWorkouts({ days = 30 }: StravaWorkoutsProps) {
  const { stravaWorkouts, syncStravaWorkouts, stravaLoading } =
    useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncStravaWorkouts();
    } catch (error) {
      console.error("Error refreshing Strava workouts:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getWorkoutIcon = (type: WorkoutData["type"]) => {
    const iconMap: Record<WorkoutData["type"], keyof typeof Ionicons.glyphMap> =
      {
        run: "walk",
        ride: "bicycle",
        swim: "water",
        workout: "fitness",
        hike: "trail-sign",
        walk: "walk",
        yoga: "body",
        other: "fitness",
      };
    return iconMap[type];
  };

  const formatDuration = (seconds: number): string => {
    const duration = moment.duration(seconds, "seconds");
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters?: number): string => {
    if (!meters) return "";
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  };

  const formatPace = (speed?: { average?: number }): string => {
    if (!speed?.average) return "";
    // Convert m/s to min/km
    const metersPerSecond = speed.average;
    const secondsPerKm = 1000 / metersPerSecond;
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = Math.floor(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
  };

  if (stravaLoading) {
    return (
      <View style={tw`p-4 items-center justify-center`}>
        <ActivityIndicator size="large" color="white" />
        <Text style={tw`text-white/60 text-sm font-mont mt-2`}>
          Loading Strava workouts...
        </Text>
      </View>
    );
  }

  if (stravaWorkouts.length === 0) {
    return (
      <View style={tw`p-4 bg-white/5 rounded-lg`}>
        <Text style={tw`text-white/60 text-sm font-mont text-center`}>
          No workouts found in the last {days} days
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={tw`flex-1`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="white"
        />
      }
    >
      <View style={tw`gap-3`}>
        {stravaWorkouts.map((workout) => (
          <View
            key={workout.id}
            style={tw`p-4 bg-white/5 rounded-lg border border-white/10`}
          >
            <View style={tw`flex-row items-start justify-between mb-2`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View
                  style={tw`w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3`}
                >
                  <Ionicons
                    name={getWorkoutIcon(workout.type)}
                    size={20}
                    color="#FF5C2A"
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text
                    style={tw`text-white font-mont-semibold text-base`}
                    numberOfLines={1}
                  >
                    {workout.name}
                  </Text>
                  <Text style={tw`text-white/60 text-xs font-mont`}>
                    {moment(workout.startDate).format("MMM D, h:mm A")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={tw`flex-row flex-wrap gap-4 mt-2`}>
              {workout.distance != null && workout.distance > 0 && (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="navigate" size={14} color="#979797" />
                  <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                    {formatDistance(workout.distance)}
                  </Text>
                </View>
              )}

              <View style={tw`flex-row items-center`}>
                <Ionicons name="time" size={14} color="#979797" />
                <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                  {formatDuration(workout.duration)}
                </Text>
              </View>

              {workout.calories != null && workout.calories > 0 && (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="flame" size={14} color="#979797" />
                  <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                    {workout.calories} cal
                  </Text>
                </View>
              )}

              {workout.speed?.average != null && workout.speed.average > 0 && (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="speedometer" size={14} color="#979797" />
                  <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                    {formatPace(workout.speed)}
                  </Text>
                </View>
              )}

              {workout.heartRate?.average != null && workout.heartRate.average > 0 && (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="heart" size={14} color="#979797" />
                  <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                    {Math.round(workout.heartRate.average)} bpm
                  </Text>
                </View>
              )}

              {workout.elevation != null && workout.elevation > 0 && (
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="trending-up" size={14} color="#979797" />
                  <Text style={tw`text-white/80 text-sm font-mont ml-1`}>
                    {Math.round(workout.elevation)}m
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
