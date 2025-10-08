import tw from "@/constants/tw";
import React from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoAttachmentsProps {
  fadeAnim: Animated.Value;
  imageUris: string[];
  onPickImage: () => void;
  onRemoveImage: (index: number) => void;
}

export function PhotoAttachments({
  fadeAnim,
  imageUris,
  onPickImage,
  onRemoveImage,
}: PhotoAttachmentsProps) {
  return (
    <Animated.View style={[tw`px-6 pt-6`, { opacity: fadeAnim }]}>
      <Text style={tw`text-white font-tussi-bold text-2xl mb-2`}>
        Add Photos
      </Text>
      <Text style={tw`text-white/60 font-mont text-sm mb-6`}>
        Capture your day (optional, max 5)
      </Text>

      <View style={tw`flex-row flex-wrap gap-3 pb-6`}>
        {imageUris.map((uri, index) => (
          <View key={index} style={tw`relative`}>
            <Image
              source={{ uri }}
              style={tw`w-28 h-28 rounded-md`}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}
            >
              <Text style={tw`text-white font-mont-bold text-xs`}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {imageUris.length < 5 && (
          <TouchableOpacity
            onPress={onPickImage}
            style={tw`w-28 h-28 bg-white/5 border-2 border-dashed border-white/20 rounded-md items-center justify-center`}
          >
            <Text style={tw`text-white/60 text-4xl mb-1`}>+</Text>
            <Text style={tw`text-white/60 font-mont text-xs`}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
