import { MAX_PHONE_HEIGHT, MAX_PHONE_WIDTH } from "@/constants/layout";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { ReactNode } from "react";
import { Modal, ModalProps, View } from "react-native";

interface PhoneModalProps extends Omit<ModalProps, "children"> {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
}

/**
 * Modal component that centers content within phone dimensions on tablets.
 * On phones, renders normally. On tablets, constrains modal to phone-sized centered viewport.
 */
export function PhoneModal({
  visible,
  children,
  onClose,
  ...modalProps
}: PhoneModalProps) {
  const { isTablet } = useGlobalContext();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      {...modalProps}
    >
      {/* Outer container: centers the entire modal viewport on tablets */}
      <View style={tw`flex-1  items-center justify-center`}>
        <View
          style={[
            tw`flex-1 w-full`,
            isTablet && {
              maxWidth: MAX_PHONE_WIDTH,
              maxHeight: MAX_PHONE_HEIGHT,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
