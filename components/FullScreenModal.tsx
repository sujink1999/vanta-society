import tw from "@/constants/tw";
import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FullScreenModalProps {
  visible: boolean;
  children: ReactNode;
}

export function FullScreenModal({ visible, children }: FullScreenModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <BlurView
        intensity={10}
        style={[
          tw`flex-1 bg-black/80 justify-end items-center px-4`,
          { paddingBottom: insets.bottom + 16 },
        ]}
        tint="dark"
      >
        <BlurView
          intensity={40}
          style={tw`w-full max-w-2xl border border-white/10 rounded-lg overflow-hidden`}
          tint="dark"
        >
          <View style={tw`min-h-[200px]`}>{children}</View>
        </BlurView>
      </BlurView>
    </Modal>
  );
}
