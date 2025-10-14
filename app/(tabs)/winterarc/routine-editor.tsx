import { RoutineEditor } from "@/components/RoutineEditor";
import tw from "@/constants/tw";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutineEditorScreen() {
  const router = useRouter();

  const handleSubmit = () => {
    router.back();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black pb-[84px]`} edges={["top"]}>
      <RoutineEditor showBackButton={true} onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}
