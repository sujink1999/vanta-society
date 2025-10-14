import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { dataSyncManager } from "@/services/storage/DataSyncManager";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface BackupTileProps {
  lastSyncTime: string | null;
  onSyncComplete?: () => void;
}

export function BackupTile({ lastSyncTime, onSyncComplete }: BackupTileProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const { addNotification } = useGlobalContext();

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const success = await dataSyncManager.forceSyncNow();
      if (success) {
        addNotification("Data synced successfully", "success", 3000);
        onSyncComplete?.();
      } else {
        addNotification(
          "Failed to sync data. Please try again.",
          "error",
          3000
        );
      }
    } catch (error) {
      console.error("Force sync error:", error);
      addNotification("Failed to sync data. Please try again.", "error", 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  const formattedLastSync = lastSyncTime
    ? moment(lastSyncTime).format("MMM D, YYYY h:mm A")
    : "Never";

  return (
    <View
      style={tw`p-3 bg-white/5 rounded-md w-full flex-row justify-between items-center`}
    >
      <View style={tw`flex-row gap-4 items-center`}>
        <View style={tw`w-8 h-8 rounded-full items-center justify-center`}>
          <Ionicons
            name="cloud-upload-outline"
            size={24}
            color={Colors.primary}
          />
        </View>
        <View style={tw`flex-col gap-2`}>
          <Text style={tw`font-tussi text-textPrimary`}>Backup</Text>
          <Text style={tw`font-mont text-xs text-textSecondary`}>
            Last Updated: {formattedLastSync}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleForceSync}
        disabled={isSyncing}
        style={tw`bg-white px-3 py-1.5 rounded-md flex-row items-center gap-2`}
      >
        {isSyncing ? (
          <ActivityIndicator
            size="small"
            color="black"
            style={tw`w-4 h-4 scale-75`}
          />
        ) : (
          <Text style={tw`font-mont-semibold text-black text-xs`}>Sync</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
