import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { stravaAuth } from "@/services/strava";
import * as AuthSession from "expo-auth-session";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STRAVA_DISCOVERY = {
  authorizationEndpoint: "https://www.strava.com/oauth/mobile/authorize",
  tokenEndpoint: "https://www.strava.com/oauth/token",
  revocationEndpoint: "https://www.strava.com/oauth/deauthorize",
};

interface StravaConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function StravaConnect({ onConnectionChange }: StravaConnectProps) {
  const {
    stravaConnected,
    stravaAthlete,
    stravaLoading,
    refreshStrava,
    disconnectStrava: globalDisconnectStrava,
  } = useGlobalContext();
  const [connecting, setConnecting] = useState(false);

  // Generate redirect URI using hook (must be at component level)
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "vantasociety",
    path: "vantasociety",
  });

  console.log("=== REDIRECT URI ===", redirectUri);

  // Get client ID from service
  const clientId = stravaAuth["clientId"];

  // Create auth request using hook
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ["activity:read"],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: false,
      extraParams: {
        approval_prompt: "force",
      },
    },
    STRAVA_DISCOVERY
  );

  // Handle OAuth response
  useEffect(() => {
    console.log("OAuth Response:", response);
    if (response?.type === "success") {
      const { code } = response.params;
      handleAuthCode(code);
    } else if (response?.type === "error") {
      console.error("OAuth Error:", response);
      Alert.alert(
        "Connection Failed",
        `Failed to connect to Strava: ${
          response.error?.message ||
          response.params?.error_description ||
          "Unknown error"
        }`
      );
      setConnecting(false);
    }
  }, [response]);

  const handleAuthCode = async (code: string) => {
    try {
      await stravaAuth.exchangeCodeForToken(code);
      await refreshStrava(); // Refresh global state
      onConnectionChange?.(true);
      Alert.alert("Success", "Connected to Strava successfully!");
    } catch (error) {
      console.error("Error exchanging auth code:", error);
      Alert.alert(
        "Connection Failed",
        "Failed to complete Strava connection. Please try again."
      );
    } finally {
      setConnecting(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const result = await promptAsync();
      console.log("Prompt result:", result);
    } catch (error) {
      console.error("Error initiating Strava auth:", error);
      Alert.alert(
        "Connection Failed",
        "Failed to initiate Strava connection. Please try again."
      );
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect Strava",
      "Are you sure you want to disconnect your Strava account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: async () => {
            try {
              await globalDisconnectStrava();
              onConnectionChange?.(false);
              Alert.alert(
                "Disconnected",
                "Strava account has been disconnected."
              );
            } catch (error) {
              console.error("Error disconnecting Strava:", error);
              Alert.alert(
                "Error",
                "Failed to disconnect Strava. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  if (stravaLoading) {
    return (
      <View style={tw`p-4 bg-white/5 rounded-lg items-center justify-center`}>
        <ActivityIndicator size="small" color="white" />
        <Text style={tw`text-white/60 text-sm font-mont mt-2`}>
          Checking Strava connection...
        </Text>
      </View>
    );
  }

  if (stravaConnected && stravaAthlete) {
    return (
      <View style={tw`p-4 bg-white/5 rounded-lg`}>
        <View style={tw`flex-row items-center mb-3`}>
          {stravaAthlete.profile_medium && (
            <Image
              source={{ uri: stravaAthlete.profile_medium }}
              style={tw`w-12 h-12 rounded-full`}
            />
          )}
          <View style={tw`ml-3 flex-1`}>
            <Text style={tw`text-white font-mont-semibold text-base`}>
              {stravaAthlete.firstname} {stravaAthlete.lastname}
            </Text>
            {stravaAthlete.username && (
              <Text style={tw`text-white/60 text-sm font-mont`}>
                @{stravaAthlete.username}
              </Text>
            )}
          </View>
          <View style={tw`bg-green-500/20 px-3 py-1 rounded-full`}>
            <Text style={tw`text-green-400 text-xs font-mont-semibold`}>
              Connected
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={tw`bg-red-500/20 px-4 py-2 rounded-lg`}
          onPress={handleDisconnect}
        >
          <Text style={tw`text-red-400 text-sm font-mont-semibold text-center`}>
            Disconnect Strava
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={tw`p-4 bg-white/5 border border-white/10 rounded-lg flex-col gap-3`}
    >
      <Image
        source={require("@/assets/images/strava-logo.png")}
        style={tw`w-14 h-14 self-center`}
      />
      <View style={tw`mb-3`}>
        <Text style={tw`text-white/60 text-sm font-mont text-center`}>
          All your workouts and runs will automatically be synced to your
          profile.
        </Text>
      </View>

      <TouchableOpacity
        style={tw`bg-[#FC4C02] px-4 py-3 rounded-md flex-row items-center justify-center ${
          connecting || !request ? "opacity-50" : ""
        }`}
        onPress={handleConnect}
        disabled={connecting || !request}
      >
        {connecting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text style={tw`text-white text-sm font-tussi-bold`}>
              CONNECT WITH STRAVA
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
