import { WorkoutTypeCard } from '@/components/workout/WorkoutTypeCard';
import tw from '@/constants/tw';
import { WorkoutType } from '@/services/api/types';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WorkoutTypeSelectionViewProps {
  onBack: () => void;
  onSelectType: (type: WorkoutType) => void;
}

export function WorkoutTypeSelectionView({
  onBack,
  onSelectType,
}: WorkoutTypeSelectionViewProps) {
  return (
    <SafeAreaView style={tw`flex-1 bg-black`} edges={['top']}>
      <View style={tw`flex-1 px-4 py-6`}>
        <TouchableOpacity onPress={onBack} style={tw`mb-4`}>
          <Text style={tw`text-primary font-mont text-sm`}>← Back</Text>
        </TouchableOpacity>

        <Text style={tw`text-white font-tussi-bold text-2xl mb-2`}>
          Log Workout
        </Text>
        <Text style={tw`text-textSecondary font-mont text-sm mb-6`}>
          Choose your workout type
        </Text>

        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          <WorkoutTypeCard
            taskName="Strength Training"
            title="Strength Training"
            description="Track exercises, sets, reps, and weight"
            color="#FF5C2A"
            onPress={() => onSelectType('strength')}
          />

          <WorkoutTypeCard
            taskName="Running"
            title="Cardio"
            description="Log running, cycling, swimming, and more"
            color="#4CAF50"
            onPress={() => onSelectType('cardio')}
          />

          <WorkoutTypeCard
            taskName="Meditation"
            title="Flexibility / Yoga"
            description="Track yoga, stretching, and mobility work"
            color="#9C27B0"
            onPress={() => onSelectType('flexibility')}
          />

          <WorkoutTypeCard
            taskName="Workout"
            title="Sports"
            description="Log basketball, soccer, tennis, and more"
            color="#2196F3"
            onPress={() => onSelectType('sports')}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
