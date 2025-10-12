import tw from "@/constants/tw";
import { Product } from "@/services/api/types";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { width: windowWidth } = useWindowDimensions();

  // Calculate card width (assuming 2 columns with padding)
  const cardWidth = (windowWidth - 48) / 2; // 48 = padding (16 * 3)

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`overflow-hidden flex-1 relative border border-white/10 rounded-sm relative`}
      activeOpacity={0.7}
    >
      {/* Image Carousel */}
      <View style={tw`relative bg-black`}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {product.imageUrls.map((imageUrl, index) => (
            <View
              key={index}
              style={[
                tw`flex-row items-center justify-center`,
                { width: cardWidth },
              ]}
            >
              <Image
                source={{ uri: imageUrl }}
                style={{
                  height: cardWidth,
                  width: cardWidth,
                }}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Content with Blur */}
      <View style={tw`p-3 pt-6 border-t border-white/5 `}>
        <Text
          style={tw`text-white text-center font-tussi-bold text-xs mb-3`}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Price */}
        {/* <Text style={tw`text-primary text-center font-mont-medium text-sm`}>
          ${product.finalCost.toFixed(2)}
        </Text> */}
        {/* <Text style={tw`text-primary text-center font-mont-medium text-sm`}>
          coming soon
        </Text> */}
      </View>
    </TouchableOpacity>
  );
}
