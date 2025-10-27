import { useWindowDimensions } from "react-native";
import { TABLET_THRESHOLD } from "@/constants/layout";

/**
 * Hook to detect if the current device is a tablet based on screen width
 * @returns true if device width is greater than TABLET_THRESHOLD (768px)
 */
export function useTablet(): boolean {
  const { width } = useWindowDimensions();
  return width > TABLET_THRESHOLD;
}
