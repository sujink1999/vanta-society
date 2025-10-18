import { DeepWorkIcon, MeditationIcon } from "@/components/icons/TaskIcons";
import { ToolCard } from "@/components/ToolCard";
import tw from "@/constants/tw";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 12; // px-3
const GAP = 12; // gap-3
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / 2;

export default function ToolsScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw` flex-row items-center px-3 pt-[13px] pb-6`}>
        <Image
          source={require("@/assets/images/society-logo-no-bg.png")}
          style={tw`w-16 h-10`}
          resizeMode="contain"
        />
      </View>

      <View style={tw`px-4 mb-3 flex-row items-center justify-between mb-6`}>
        <View style={tw`flex-col gap-1`}>
          <Text style={tw`text-textPrimary font-tussi-bold text-lg`}>
            TOOLS
          </Text>
          <Text style={tw`text-white/90 font-mont text-[11px]`}>
            Powerful tools to enhance your journey
          </Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1 px-3 py-3`}>
        <View style={tw`flex-row flex-wrap gap-3`}>
          <ToolCard
            icon={<DeepWorkIcon size={28} color="white" />}
            title="Deep Focus"
            description="Start a deep focus session to help you stay focused and productive"
            onPress={() => router.push("/(tools)/deep-focus")}
            width={CARD_WIDTH}
          />

          <ToolCard
            icon={<MeditationIcon size={28} color="white" />}
            title="Meditation"
            description="Guided meditation sessions to calm your mind and reduce stress"
            onPress={() => router.push("/(tools)/meditation")}
            width={CARD_WIDTH}
          />

          <ToolCard
            icon={<Ionicons name="library" size={28} color="white" />}
            title="Read Books"
            description="Learn key insights from curated books in bite-sized summaries"
            onPress={() => router.push("/(tools)/book-summaries")}
            width={CARD_WIDTH}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
