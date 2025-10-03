import tw from "@/constants/tw";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoadingScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#FF5C2A" />
        <Text style={tw`text-base font-mont text-textSecondary mt-4`}>
          Loading...
        </Text>
      </View>
    </SafeAreaView>
  );
}
