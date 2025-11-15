import tw from '@/constants/tw';
import React from 'react';
import { Text, View } from 'react-native';

interface WorkoutStatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  subtitle?: string;
}

export function WorkoutStatsCard({
  label,
  value,
  icon,
  subtitle,
}: WorkoutStatsCardProps) {
  return (
    <View style={tw`bg-white/5 rounded-md p-4 flex-1 min-w-[100px]`}>
      {icon && <Text style={tw`text-2xl mb-2`}>{icon}</Text>}
      <Text style={tw`text-primary font-tussi-bold text-2xl`}>{value}</Text>
      <Text style={tw`text-textSecondary font-mont text-xs mt-1`}>
        {label}
      </Text>
      {subtitle && (
        <Text style={tw`text-textSecondary font-mont text-xs mt-0.5`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
