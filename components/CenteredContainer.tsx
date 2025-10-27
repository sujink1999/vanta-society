import { MAX_PHONE_HEIGHT, MAX_PHONE_WIDTH } from "@/constants/layout";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React from "react";
import { View } from "react-native";

interface CenteredContainerProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that centers content on tablets while maintaining
 * phone-width and phone-height layout. On phones, acts as a pass-through.
 */
export function CenteredContainer({ children }: CenteredContainerProps) {
  const { isTablet } = useGlobalContext();

  if (!isTablet) {
    // On phones, just pass through
    return <>{children}</>;
  }

  // On tablets, center content both horizontally and vertically with max phone dimensions
  return (
    <View style={tw`flex-1 bg-black items-center justify-center `}>
      <View
        style={[
          tw`bg-black relative `,
          {
            width: MAX_PHONE_WIDTH,
            height: MAX_PHONE_HEIGHT,
            maxWidth: "100%",
            maxHeight: "100%",
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}
