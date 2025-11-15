import { ChevronRightIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function StravaTile() {
  const router = useRouter();
  const { stravaConnected } = useGlobalContext();

  const handlePress = () => {
    router.push("/(tabs)/winterarc/strava");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={tw`p-3 bg-white/5 rounded-md w-full flex-row gap-4 items-center`}
    >
      <View style={tw`w-8 h-8 rounded-full items-center justify-center`}>
        <Image
          source={require("@/assets/images/strava-logo.png")}
          style={tw`w-5 h-5`}
        />
      </View>

      <View style={tw`flex-col gap-2 flex-1 items-start`}>
        <Text style={tw`font-tussi text-textPrimary`}>Strava Integration</Text>

        {stravaConnected ? (
          <View style={tw`bg-green-500/20 px-2 py-1 rounded-full`}>
            <Text style={tw`text-green-400 text-[10px] font-mont-semibold`}>
              Connected
            </Text>
          </View>
        ) : (
          <View
            style={tw`bg-white/5 border border-white/5 px-2 py-1 rounded-full`}
          >
            <Text style={tw`text-white text-[10px] font-mont-semibold`}>
              Not connected
            </Text>
          </View>
        )}
      </View>

      <ChevronRightIcon size={16} color="#888" />
    </TouchableOpacity>
  );
}
