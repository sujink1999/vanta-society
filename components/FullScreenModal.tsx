import { PhoneModal } from "@/components/PhoneModal";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import tw from "@/constants/tw";
import React, { ReactNode } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FullScreenModalProps {
  visible: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  closeOnOutsidePress?: () => void;
  tint?: "dark" | "light";
}

export function FullScreenModal({
  visible,
  children,
  style,
  closeOnOutsidePress,
  tint = "dark",
}: FullScreenModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <PhoneModal visible={visible} statusBarTranslucent={true}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeOnOutsidePress || undefined}
        style={tw`flex-1`}
      >
        <PlatformBlurView
          intensity={10}
          opacity={0.9}
          style={[
            tw`flex-1 bg-black/80 justify-end items-center px-2`,
            { paddingBottom: insets.bottom + 16 },
          ]}
          tint="dark"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={tw`w-full max-w-2xl`}
          >
            <PlatformBlurView
              intensity={40}
              style={[
                tw`w-full border border-white/10 rounded-lg overflow-hidden`,
                style,
              ]}
              tint={tint}
            >
              <View style={tw`min-h-[200px]`}>{children}</View>
            </PlatformBlurView>
          </TouchableOpacity>
        </PlatformBlurView>
      </TouchableOpacity>
    </PhoneModal>
  );
}
