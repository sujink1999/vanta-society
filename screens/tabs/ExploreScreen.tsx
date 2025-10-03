import tw from "@/constants/tw";
import { Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black p-4`}>
      <Text
        style={tw`text-textPrimary mb-4 text-center font-tussi-bold text-6`}
      >
        Explore
      </Text>
      <Text style={tw`text-textSecondary text-base font-mont text-center`}>
        Discover opportunities and connections
      </Text>
    </View>
  );
}