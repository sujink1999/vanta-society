import { BackButton } from "@/components/BackButton";
import { StravaConnect } from "@/components/strava/StravaConnect";
import { StravaWorkouts } from "@/components/strava/StravaWorkouts";
import tw from "@/constants/tw";
import { stravaAuth } from "@/services/strava";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StravaScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    const connected = await stravaAuth.isConnected();
    setIsConnected(connected);
    setLoading(false);
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
      <View style={tw`flex-row items-center px-3 py-3`}>
        <BackButton onPress={() => router.back()} />
        <Text style={tw`font-tussi text-white text-xl ml-4`}>
          Strava Integration
        </Text>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-3 pb-[100px]`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`gap-4 mt-4`}>
          {/* Connection Section */}
          <StravaConnect onConnectionChange={handleConnectionChange} />

          {/* Workouts Section */}
          {!loading && isConnected && (
            <View style={tw`mt-4`}>
              <Text style={tw`font-mont text-white/50 text-sm mb-3`}>
                Recent Activities
              </Text>
              <StravaWorkouts days={30} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
