import tw from '@/constants/tw';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PlatformBlurView } from '../PlatformBlurView';
import { getTaskIcon } from '../icons/TaskIcons';

interface WorkoutTypeCardProps {
  taskName: string;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
}

export function WorkoutTypeCard({
  taskName,
  title,
  description,
  color,
  onPress,
}: WorkoutTypeCardProps) {
  const IconComponent = getTaskIcon(taskName);

  return (
    <TouchableOpacity onPress={onPress} style={tw`mb-3`}>
      <PlatformBlurView
        intensity={30}
        tint="dark"
        style={tw`rounded-xl overflow-hidden border border-white/10`}
      >
        <View style={tw`flex-row items-center p-4 gap-3`}>
          <View
            style={[
              tw`w-12 h-12 rounded-xl items-center justify-center`,
              { backgroundColor: `${color}20` },
            ]}
          >
            {IconComponent && <IconComponent size={24} color={color} />}
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-white font-tussi-bold text-lg mb-1`}>
              {title}
            </Text>
            <Text style={tw`text-white/60 font-mont text-sm`}>
              {description}
            </Text>
          </View>
        </View>
      </PlatformBlurView>
    </TouchableOpacity>
  );
}
