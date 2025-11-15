import tw from "@/constants/tw";
import { Set } from "@/services/api/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SetRowProps {
  setNumber: number;
  set: Set;
  onChange: (set: Set) => void;
  onRemove: () => void;
}

export function SetRow({ setNumber, set, onChange, onRemove }: SetRowProps) {
  const toggleUnit = () => {
    onChange({
      ...set,
      unit: set.unit === "lbs" ? "kg" : "lbs",
    });
  };

  return (
    <View style={tw`flex-row items-center gap-2 mb-2`}>
      <Text style={tw`text-textSecondary font-mont text-sm w-3 `}>
        {setNumber}
      </Text>

      <View style={tw`flex-row items-center gap-2 flex-1`}>
        {/* Reps Input */}
        <View style={tw`flex-1`}>
          <TextInput
            style={tw`bg-black/40 h-10 border border-white/10 rounded-md px-3  text-white font-mont text-sm`}
            placeholder="0"
            placeholderTextColor="#979797"
            keyboardType="number-pad"
            value={set.reps === 0 ? "" : set.reps.toString()}
            onChangeText={(text) => {
              const reps = parseInt(text || "0") || 0;
              onChange({ ...set, reps });
            }}
          />
        </View>

        {/* Weight Input */}
        <View style={tw`flex-1`}>
          <TextInput
            style={tw`bg-black/40 h-10 border border-white/10 rounded-md px-3 py-2 text-white font-mont text-sm`}
            placeholder="0"
            placeholderTextColor="#979797"
            keyboardType="decimal-pad"
            value={set.weight === 0 ? "" : set.weight.toString()}
            onChangeText={(text) => {
              const weight = parseFloat(text) || 0;
              onChange({ ...set, weight });
            }}
          />
        </View>
      </View>

      {/* Remove Button */}
      {setNumber === 1 ? (
        <View style={tw`w-8`}></View>
      ) : (
        <TouchableOpacity onPress={onRemove} style={tw` rounded-md p-2`}>
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
