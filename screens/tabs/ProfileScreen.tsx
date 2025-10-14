import { GradientText } from "@/components/GradientText";
import { ProfileMetrics } from "@/components/ProfileMetrics";
import { VitalsComparison } from "@/components/VitalsComparison";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import { BackupTile } from "@/components/profile-tiles/BackupTile";
import { MyRoutineTile } from "@/components/profile-tiles/MyRoutineTile";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useElapsedTime } from "@/hooks/useElapsedTime";
import { dataSyncManager } from "@/services/storage/DataSyncManager";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, winterArcStats } = useGlobalContext();
  const router = useRouter();
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const elapsedTime = useElapsedTime({
    startDate: user?.winterArcStartDate || "",
  });

  // Load last sync time on mount
  useEffect(() => {
    const loadSyncTime = async () => {
      await dataSyncManager.initialize();
      const syncTime = dataSyncManager.getLastSyncTime();
      setLastSyncTime(syncTime);
    };
    loadSyncTime();
  }, []);

  const handleSyncComplete = async () => {
    await dataSyncManager.initialize();
    const syncTime = dataSyncManager.getLastSyncTime();
    setLastSyncTime(syncTime);
  };

  if (!user) return <></>;

  const firstName = user.firstName || "";
  const name =
    firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase();

  const currentDay = user.winterArcStartDate
    ? Math.max(
        1,
        Math.min(66, moment().diff(moment(user.winterArcStartDate), "days") + 1)
      )
    : 1;

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={tw`  p-2 ml-3 mt-3 bg-white/5 self-start border border-white/5 rounded-md`}
      >
        <ChevronLeftIcon size={20} color="white" />
      </TouchableOpacity>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-3 pb-[100px] `}
      >
        <View style={tw` relative flex-col gap-8 items-center`}>
          <View style={tw`flex-col items-center justify-center gap-2  `}>
            <Text style={tw`font-tussi text-textSecondary`}>
              {name}&apos;s Winter Arc
            </Text>
            <GradientText style={tw` font-tussi text-2xl`}>
              {elapsedTime.days}d: {elapsedTime.hours}h: {elapsedTime.minutes}m:{" "}
              {elapsedTime.seconds}s
            </GradientText>
          </View>

          {/* Profile Metrics */}
          <View style={tw`w-full`}>
            <ProfileMetrics
              inviteCode={user.inviteCode || ""}
              societyScore={Math.round(
                winterArcStats.currentScores.society ?? 0
              )}
              streak={winterArcStats.streak}
              streakCadenceLast7Days={winterArcStats.streakCadenceLast7Days}
            />
          </View>

          {/* Vitals Comparison */}
          <View style={tw` w-full rounded-md pb-4 `}>
            <VitalsComparison
              currentScores={winterArcStats.currentScores}
              potentialScores={winterArcStats.potentialScores}
              oldScores={winterArcStats.oldScores}
            />
          </View>

          {/* Profile Tiles */}

          <View style={tw`w-full gap-2 mt-10`}>
            <MyRoutineTile />
            <BackupTile
              lastSyncTime={lastSyncTime}
              onSyncComplete={handleSyncComplete}
            />

            <View style={tw`p-3 bg-white/5 rounded-md w-full flex-row gap-4`}>
              <Image
                style={tw`w-8 h-8 rounded-full bg-white/5`}
                source={{ uri: user.profileImage || "" }}
              />
              <View style={tw`flex-col gap-2`}>
                <Text style={tw`font-tussi text-textPrimary`}>
                  {user.firstName} {user.lastName}{" "}
                </Text>
                <Text style={tw`font-mont text-textSecondary`}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Chart */}
          {/* <View style={tw`w-full  `}>
            <ProgressChart
              tasksCompletedCumulative={winterArcStats.tasksCompletedCumulative}
              startDate={user.winterArcStartDate || ""}
              currentDay={currentDay}
            />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
