import {
  CheckIcon,
  CopyIcon,
  LevelIcon,
  StreakIcon,
  VitalIcon,
} from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileMetricsProps {
  inviteCode: string;
  societyScore: number;
  streak: number;
  streakCadenceLast7Days: number[];
}

export function ProfileMetrics({
  inviteCode,
  societyScore,
  streak,
  streakCadenceLast7Days,
}: ProfileMetricsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyInviteCode = async (
    inviteCode: string,
    setIsCopied: (isCopied: boolean) => void
  ) => {
    try {
      await Clipboard.setStringAsync(inviteCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Error copying invite code:", error);
    }
  };

  return (
    <View style={tw`flex-col gap-2`}>
      <View style={tw`flex-row gap-2 justify-center`}>
        <View
          style={tw`flex-1 bg-white/5  rounded-md p-4 flex-col items-center gap-2`}
        >
          <View style={tw`flex-row gap-2 items-center`}>
            <LevelIcon size={20} color={Colors.primary} />
            <Text style={tw`text-white font-tussi text-xl`}>Starter</Text>
          </View>

          <Text style={tw`text-textSecondary font-tussi text-xs`}>Level 1</Text>
        </View>

        <View
          style={tw`flex-1 bg-white/5  rounded-md p-4 flex-col items-center gap-2`}
        >
          <View style={tw`flex-row gap-2 items-center`}>
            <VitalIcon size={20} color={Colors.primary} />
            <Text style={tw`text-white font-tussi text-xl`}>
              {societyScore}
            </Text>
          </View>
          <Text style={tw`text-textSecondary font-tussi text-xs`}>
            Vitals Score
          </Text>
        </View>
      </View>
      <View
        style={tw` bg-white/5  rounded-md p-4 flex-row justify-between items-center gap-2`}
      >
        <View style={tw`flex-col gap-4`}>
          <Text style={tw`text-textSecondary font-tussi text-xs`}>
            Current Streak
          </Text>

          <View style={tw`flex-row items-center gap-1`}>
            {streakCadenceLast7Days.map((day, index) => (
              <View
                key={index}
                style={[
                  tw`w-3 h-3 rounded-full`,
                  {
                    backgroundColor: day === 0 ? "#ffffff30" : "#ffffffaa",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={tw`flex-row gap-2 items-center`}>
          <StreakIcon size={20} color={Colors.primary} />
          <Text style={tw`text-white font-tussi text-xl`}>{streak}</Text>
        </View>
      </View>
      <View
        style={tw`bg-white/5  rounded-md p-3 w-full flex-row items-center justify-between`}
      >
        <Text style={tw`text-white/60 font-tussi text-xs text-center ml-2 `}>
          Invite Code
        </Text>
        <View style={tw`flex-row items-center justify-center gap-3`}>
          <Text style={tw`text-white font-tussi text-base`}>{inviteCode}</Text>
          <TouchableOpacity
            onPress={() => handleCopyInviteCode(inviteCode, setIsCopied)}
            style={tw`p-2`}
          >
            {isCopied ? (
              <CheckIcon size={20} color="#22c55e" />
            ) : (
              <CopyIcon size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
