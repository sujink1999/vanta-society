import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";

interface BenefitCardProps {
  title: string;
  percentage: string;
  icon?: string;
}

export function BenefitCard({ title, percentage, icon }: BenefitCardProps) {
  return (
    <View style={tw`bg-white/8  rounded-lg p-4 flex-1 `}>
      <Text style={tw`text-white/70 font-mont text-xs mb-2`}>{title}</Text>
      <Text style={tw`text-white font-mont-bold text-3xl`}>
        {percentage} {icon && <Text style={tw`text-primary`}>↑</Text>}
      </Text>
    </View>
  );
}
