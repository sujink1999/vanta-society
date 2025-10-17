import { DeepWorkIcon } from "@/components/icons/TaskIcons";
import tw from "@/constants/tw";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 12; // px-3
const GAP = 12; // gap-3
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / 2;

export default function ToolsScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <View style={tw` flex-row items-center justify-left px-3 pt-[13px] pb-6`}>
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
          {/* Deep Focus Card */}
          <TouchableOpacity
            style={[
              tw`bg-white/5 border border-white/5 rounded-md p-3 py-4 flex-col items-left`,
              { width: CARD_WIDTH },
            ]}
            onPress={() => router.push("/(tools)/deep-focus")}
            activeOpacity={0.5}
          >
            <View style={tw`bg-white/10 rounded-full p-4 mb-4 self-start `}>
              <DeepWorkIcon size={32} color="white" />
            </View>
            <Text
              style={tw`text-white font-tussi-bold text-base mb-2 text-left`}
            >
              Deep Focus
            </Text>
            <Text
              style={tw`text-white/60 font-mont text-xs  text-left`}
              numberOfLines={3}
            >
              Start a deep focus session to help you stay focused and productive
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
