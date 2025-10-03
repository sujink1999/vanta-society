import tw from "@/constants/tw";
import React from "react";
import { Text, View } from "react-native";

interface TimelineItem {
  month: string;
  year: string;
  status: 'gone' | 'current' | 'future';
  isLifeReset?: boolean;
  description?: string;
  progress?: string;
}

interface TimelineComponentProps {
  items: TimelineItem[];
}

export function TimelineComponent({ items }: TimelineComponentProps) {
  return (
    <View style={tw`w-full`}>
      {items.map((item, index) => (
        <View key={index} style={tw`flex-row items-start mb-6`}>
          {/* Timeline Dot and Line */}
          <View style={tw`items-center mr-4 mt-1`}>
            <View
              style={[
                tw`w-3 h-3 rounded-full`,
                item.status === 'gone'
                  ? tw`bg-primary`
                  : item.isLifeReset
                  ? tw`bg-primary`
                  : tw`bg-white/40`,
              ]}
            />
            {index < items.length - 1 && (
              <View
                style={[
                  tw`w-0.5 h-12 mt-2`,
                  item.status === 'gone' || item.isLifeReset
                    ? tw`bg-primary`
                    : item.status === 'future'
                    ? tw`border-l border-dashed border-white/40`
                    : tw`bg-white/20`,
                ]}
              />
            )}
          </View>

          {/* Content */}
          <View style={tw`flex-1 mt-0.5`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-white font-mont text-sm mr-3`}>
                📅 {item.month} {item.year}
              </Text>
              {item.status === 'gone' && (
                <View style={tw`bg-white/20 px-2 py-1 rounded`}>
                  <Text style={tw`text-white/70 font-mont text-xs`}>GONE</Text>
                </View>
              )}
            </View>

            {item.isLifeReset && (
              <View style={tw`bg-primary px-3 py-2 rounded mb-3 self-start`}>
                <Text style={tw`text-white font-mont-semibold text-xs`}>
                  🔥 START MY FIRST LIFE RESET
                </Text>
              </View>
            )}

            {item.description && (
              <Text style={tw`text-white/80 font-mont text-sm mb-2 leading-5`}>
                {item.description}
              </Text>
            )}

            {item.progress && (
              <View style={tw`flex-row items-center mt-2`}>
                <View style={tw`mr-3`}>
                  {item.progress.includes('50%') ? (
                    <Text style={tw`text-white text-lg`}>⚡</Text>
                  ) : (
                    <Text style={tw`text-white text-lg`}>🏆</Text>
                  )}
                </View>
                <Text style={tw`text-white font-mont-semibold text-sm`}>
                  {item.progress}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}