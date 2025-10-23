import { CheckIcon, CopyIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  const { user } = useGlobalContext();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyInviteCode = async () => {
    if (!user?.inviteCode) return;
    try {
      await Clipboard.setStringAsync(user.inviteCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying invite code:", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={["top"]}>
      {/* Background Image */}
      <Image
        source={require("@/assets/images/map.png")}
        style={tw`absolute w-full h-full opacity-60`}
        resizeMode="cover"
      />

      <View style={tw`flex-1 justify-center items-center p-4 gap-8`}>
        <BlurView
          intensity={30}
          style={tw`bg-white/5 border border-white/10 rounded-md p-3 w-full max-w-sm overflow-hidden`}
          tint="dark"
        >
          <View style={tw`w-full gap-3 flex items-center justify-center mb-10`}>
            <Text style={tw`text-white/80 font-tussi-bold text-xl mt-2 `}>
              LEVEL UP TOGETHER
            </Text>

            <View style={tw`px-3 py-1 bg-white/10 rounded-md `}>
              <Text style={tw`text-white/80 font-tussi `}>Coming Soon</Text>
            </View>
          </View>
          {/* Invite Code Section */}
          {user?.inviteCode && (
            <View style={tw`w-full max-w-sm gap-3`}>
              <Text style={tw`text-white/80 font-tussi text-center text-sm`}>
                Refer a friend
              </Text>
              <View
                style={tw`bg-white/5 border border-white/10 rounded-md p-3 py-2 w-full flex-row items-center justify-between`}
              >
                <Text style={tw`text-white/60 font-tussi text-xs`}>
                  Invite Code
                </Text>
                <View style={tw`flex-row items-center gap-3`}>
                  <Text style={tw`text-white font-tussi text-base`}>
                    {user.inviteCode}
                  </Text>
                  <TouchableOpacity
                    onPress={handleCopyInviteCode}
                    style={tw`p-1`}
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
          )}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}
