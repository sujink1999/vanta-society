import { PlatformBlurView } from "@/components/PlatformBlurView";
import { PhoneModal } from "@/components/PhoneModal";
import tw from "@/constants/tw";
import React, { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FullScreenModalProps {
  visible: boolean;
  children: ReactNode;
}

export function FullScreenModal({ visible, children }: FullScreenModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <PhoneModal visible={visible} statusBarTranslucent={true}>
      <PlatformBlurView
        intensity={10}
        opacity={0.9}
        style={[
          tw`flex-1 bg-black/80 justify-end items-center px-4`,
          { paddingBottom: insets.bottom + 16 },
        ]}
        tint="dark"
      >
        <PlatformBlurView
          intensity={40}
          style={tw`w-full max-w-2xl border border-white/10 rounded-lg overflow-hidden`}
          tint="dark"
        >
          <View style={tw`min-h-[200px]`}>{children}</View>
        </PlatformBlurView>
      </PlatformBlurView>
    </PhoneModal>
  );
}
