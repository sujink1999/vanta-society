import tw from "@/constants/tw";
import { BlurView, BlurViewProps } from "expo-blur";
import { Platform, View } from "react-native";

interface PlatformBlurViewProps extends BlurViewProps {
  opacity?: number; // Opacity for Android fallback (0-1)
}

export function PlatformBlurView({
  opacity = 1,
  style,
  children,
  ...blurProps
}: PlatformBlurViewProps) {
  if (Platform.OS === "android") {
    // Android: Use a black box with opacity
    const flattenedStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;

    const styleHasBorder = flattenedStyle?.borderWidth > 0;

    return (
      <View
        onTouchEnd={blurProps.onTouchEnd}
        style={[
          flattenedStyle,
          styleHasBorder && tw`border border-white/10`,
          {
            backgroundColor: `rgba(0, 0, 0, ${opacity})`,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // iOS: Use BlurView with experimental method
  return (
    <BlurView {...blurProps} style={style}>
      {children}
    </BlurView>
  );
}
