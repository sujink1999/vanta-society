import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-white font-tussi-bold text-3xl mb-4 text-center`}>
          COMMUNITY
        </Text>
        <Text style={tw`text-white/60 font-mont text-center text-lg mb-8`}>
          Connect with fellow Winter Arc participants
        </Text>
        <View style={tw`bg-white/5 border border-white/10 rounded-lg p-6 w-full max-w-sm`}>
          <Text style={tw`text-white/80 font-mont text-center`}>
            Community features coming soon...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}