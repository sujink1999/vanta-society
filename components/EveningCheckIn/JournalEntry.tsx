import tw from "@/constants/tw";
import React from "react";
import { Animated, Text, TextInput, View } from "react-native";

interface JournalEntryProps {
  fadeAnim: Animated.Value;
  journal: string;
  onChangeJournal: (text: string) => void;
}

export function JournalEntry({
  fadeAnim,
  journal,
  onChangeJournal,
}: JournalEntryProps) {
  return (
    <Animated.View style={[tw`px-6 pt-6 pb-6`, { opacity: fadeAnim }]}>
      <Text style={tw`text-white font-tussi-bold text-2xl mb-2`}>
        Daily Journal
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm mb-6`}>
        Reflect on your day (optional)
      </Text>

      <TextInput
        style={tw`bg-white/5 border border-white/10 rounded-md p-4 text-white font-mont text-base min-h-40`}
        placeholder="How was your day? What did you accomplish?"
        placeholderTextColor="#979797"
        multiline
        textAlignVertical="top"
        value={journal}
        onChangeText={onChangeJournal}
      />
    </Animated.View>
  );
}
