import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import tw from '@/constants/tw';
import { OnboardingStepData } from '../Onboarding';
import { setCategoryRoutine } from '@/services/api/routines';
import { useGlobalContext } from '@/contexts/GlobalContext';

interface BuildRoutineStepProps {
  data: OnboardingStepData;
  updateData: (data: Partial<OnboardingStepData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const CATEGORIES = [
  {
    id: 'morning',
    title: 'Morning Optimization',
    description: 'Start your day with purpose and energy',
    routines: ['Meditation', 'Exercise', 'Journaling', 'Cold Shower'],
  },
  {
    id: 'productivity',
    title: 'Peak Productivity',
    description: 'Maximize focus and output during work hours',
    routines: ['Deep Work Blocks', 'Pomodoro Technique', 'Email Management', 'Priority Setting'],
  },
  {
    id: 'evening',
    title: 'Evening Recovery',
    description: 'Wind down and prepare for optimal sleep',
    routines: ['Reading', 'Gratitude Practice', 'Screen Detox', 'Stretching'],
  },
  {
    id: 'wellness',
    title: 'Health & Wellness',
    description: 'Maintain physical and mental well-being',
    routines: ['Nutrition Tracking', 'Hydration Goals', 'Mindfulness', 'Movement'],
  },
];

export function BuildRoutineStep({ data, updateData, onNext, onPrev, isFirst }: BuildRoutineStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refetchUser } = useGlobalContext();

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a routine category');
      return;
    }

    const category = CATEGORIES.find(cat => cat.id === selectedCategory);
    if (!category) return;

    setIsLoading(true);
    try {
      const response = await setCategoryRoutine({
        category: selectedCategory,
        routines: category.routines,
      });

      if (response.success) {
        updateData({ routine: response.data });
        await refetchUser(); // Update user context
        onNext();
      } else {
        Alert.alert('Error', 'Failed to set up routine. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set up routine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-6 py-8`}>
      <View style={tw`mb-8`}>
        <Text style={tw`text-3xl font-tussi-bold text-white text-center mb-4`}>
          Build Your Routine
        </Text>
        <Text style={tw`text-base font-mont text-textSecondary text-center`}>
          Choose a category to start optimizing your daily performance
        </Text>
      </View>

      <View style={tw`mb-8`}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              tw`bg-white/10 border border-white/20 rounded-lg p-4 mb-4`,
              selectedCategory === category.id && tw`border-primary bg-primary/20`,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={tw`text-white font-mont-semibold text-lg mb-2`}>
              {category.title}
            </Text>
            <Text style={tw`text-textSecondary font-mont text-sm mb-3`}>
              {category.description}
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {category.routines.map((routine, index) => (
                <View
                  key={index}
                  style={tw`bg-white/20 rounded-full px-3 py-1 mr-2 mb-2`}
                >
                  <Text style={tw`text-white font-mont text-xs`}>{routine}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={tw`flex-row justify-between mt-auto pt-8`}>
        {!isFirst && (
          <TouchableOpacity
            style={tw`bg-white/10 rounded-lg py-3 px-6`}
            onPress={onPrev}
          >
            <Text style={tw`text-white font-mont-medium text-base`}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            tw`bg-primary rounded-lg py-3 px-6 ml-auto`,
            (!selectedCategory || isLoading) && tw`opacity-50`,
          ]}
          onPress={handleSubmit}
          disabled={!selectedCategory || isLoading}
        >
          <Text style={tw`text-white font-mont-medium text-base`}>
            {isLoading ? 'Setting up...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}