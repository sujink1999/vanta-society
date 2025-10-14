import { ChevronRightIcon } from "@/components/icons/Icons";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function MyRoutineTile() {
  const router = useRouter();

  const handleEditRoutine = () => {
    router.push("/(tabs)/winterarc/routine-editor");
  };

  return (
    <TouchableOpacity
      onPress={handleEditRoutine}
      style={tw`p-3 bg-white/5 rounded-md w-full flex-row gap-4 items-center`}
    >
      <View style={tw`w-8 h-8 rounded-full items-center justify-center`}>
        <Ionicons name="repeat-outline" size={24} color={Colors.primary} />
      </View>
      <View style={tw`flex-col gap-2`}>
        <Text style={tw`font-tussi text-textPrimary`}>Manage Routine</Text>
      </View>
      <View style={tw`flex-row justify-end gap-1 flex-1`}>
        <ChevronRightIcon size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );
}
