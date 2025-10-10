import { LevelIcon, StreakIcon, VitalIcon } from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function Header() {
  const { winterArcStats } = useGlobalContext();
  const router = useRouter();

  const streak = winterArcStats.streak;
  const level = 1;
  const vitalScore = Math.round(winterArcStats.currentScores.society ?? 0);

  return (
    <View style={tw`flex-row items-center justify-between `}>
      <Image
        source={require("@/assets/images/society-logo-no-bg.png")}
        style={tw`w-16 h-10`}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/winterarc/profile")}
        style={tw`  rounded-md flex-row items-center justify-end p-2 py-1 gap-1 bg-white/5  border border-white/5`}
      >
        {/* Streak */}
        <View style={tw`  px-3 py-2 flex-row items-center gap-2`}>
          <StreakIcon size={14} color={Colors.primary} />
          <Text style={tw`text-white font-mont-medium text-xs`}>{streak}</Text>
        </View>
        <View style={tw`w-px h-4 bg-white/20`} />

        {/* Level */}
        <View style={tw` px-3 py-2 flex-row items-center gap-2`}>
          <LevelIcon size={14} color={Colors.primary} />
          <Text style={tw`text-white font-mont-medium text-xs`}>
            Lvl {level}
          </Text>
        </View>
        <View style={tw`w-px h-4 bg-white/20`} />

        {/* Vital Score */}
        <View style={tw`  px-3 py-2 flex-row items-center gap-2`}>
          <VitalIcon size={14} color={Colors.primary} />
          <Text style={tw`text-white font-mont-medium text-xs`}>
            {vitalScore}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
