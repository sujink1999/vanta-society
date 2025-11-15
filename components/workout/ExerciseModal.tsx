import { PhoneModal } from "@/components/PhoneModal";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import tw from "@/constants/tw";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ExerciseModalProps {
  visible: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
}

export function ExerciseModal({
  visible,
  children,
  style,
  onClose,
}: ExerciseModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <PhoneModal visible={visible} statusBarTranslucent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-1 * insets.bottom}
        style={tw`flex-1`}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
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
                tint="light"
              >
                {children}
              </PlatformBlurView>
            </TouchableOpacity>
          </PlatformBlurView>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </PhoneModal>
  );
}
