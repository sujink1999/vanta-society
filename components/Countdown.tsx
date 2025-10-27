import { CheckIcon, CopyIcon, ShareIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTimeLeft } from "@/hooks/useTimeLeft";
import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { Header } from "./Header";

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

export function Countdown() {
  const { user } = useGlobalContext();
  const cardRef = useRef<View>(null);
  const shareRef = useRef<View>(null);
  const [isCopied, setIsCopied] = useState(false);

  const timeLeft = useTimeLeft({
    targetDate: user?.winterArcStartDate || "",
    onComplete: () => {},
  });

  const handleShare = async () => {
    try {
      if (!shareRef.current) return;
      // Capture the hidden share view as an image
      const uri = await captureRef(shareRef.current, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
      });

      console.log("Image captured, URI:", uri);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      console.log("Sharing available:", isAvailable);

      if (isAvailable) {
        console.log("Attempting to share...");
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share your Winter Arc card",
        });
        console.log("Share completed successfully");
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert("Error", `Share failed: ${errorMessage}`);
    }
  };

  return (
    <View style={tw`flex-1 px-3 py-3`}>
      {/* Hidden view for Instagram story sharing - positioned off-screen */}
      <View
        style={{
          position: "absolute",
          left: -10000,
          width: 400,
          height: 712,
        }}
        collapsable={false}
        ref={shareRef}
      >
        <View style={tw`w-full h-full bg-black items-center justify-center`}>
          <View
            style={tw`w-[250px] h-[360px] relative overflow-hidden rounded-lg`}
          >
            <Image
              source={require("@/assets/images/winter-arc-card.png")}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            <View
              style={tw`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center`}
            >
              <View style={tw`items-center`}>
                <Text
                  style={tw`text-white font-tussi-bold text-center text-sm mb-2`}
                >
                  {user?.firstName?.toUpperCase()}{" "}
                  {user?.lastName?.toUpperCase()}
                </Text>
                <Text style={tw`text-white font-tussi text-xs`}>
                  #{user?.id?.toString().padStart(2, "0")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Visible UI */}
      <ScrollView style={tw`flex-1 `}>
        <View
          style={tw`flex-col items-center flex-1 justify-around  gap-8 pb-8 pt-6`}
        >
          <View style={tw` flex-col items-center gap-4`}>
            <Text style={tw`text-white font-tussi text-center text-sm`}>
              YOUR WINTER ARC{"\n"}STARTS IN
            </Text>
            <View style={tw`flex-row justify-around`}>
              <Text style={tw`text-2xl font-tussi text-primary`}>
                {timeLeft.days}d: {timeLeft.hours}h: {timeLeft.minutes}m:{" "}
                {timeLeft.seconds}s
              </Text>
            </View>
          </View>
          <View>
            <View collapsable={false} ref={cardRef}>
              <View
                style={tw`w-[250px] h-[360px] relative overflow-hidden rounded-lg`}
              >
                <Image
                  source={require("@/assets/images/winter-arc-card.png")}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />

                <View
                  style={tw`absolute bottom-6 left-1/2 -translate-x-1/2  flex items-center justify-center`}
                >
                  <View style={tw`items-center`}>
                    <Text
                      style={tw`text-white font-tussi-bold text-center text-sm mb-2`}
                    >
                      {user?.firstName?.toUpperCase()}{" "}
                      {user?.lastName?.toUpperCase()}
                    </Text>
                    <Text style={tw`text-white font-tussi text-xs`}>
                      #{user?.id?.toString().padStart(2, "0")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              onPress={handleShare}
              style={tw`  self-stretch mt-3 flex-row bg-white/10 rounded-md  items-center justify-center py-2 px-4 gap-2`}
            >
              <ShareIcon size={12} color="white" />
              <Text style={tw`text-white font-tussi text-xs`}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Countdown Display */}

          {/* Invite Code Section */}
          <View style={tw`mt-10 gap-2`}>
            <Header showLogo={false} />

            <View
              style={tw`bg-white/5  rounded-md p-3 w-full flex-row items-center justify-between`}
            >
              <Text
                style={tw`text-white/60 font-mont text-xs text-center ml-2 `}
              >
                Invite Code
              </Text>
              <View style={tw`flex-row items-center justify-center gap-3`}>
                <Text style={tw`text-white font-tussi text-base`}>
                  {user?.inviteCode}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopyInviteCode(user?.inviteCode || "", setIsCopied)
                  }
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
        </View>
      </ScrollView>
    </View>
  );
}
