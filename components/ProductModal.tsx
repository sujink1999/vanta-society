import { Button } from "@/components/Button";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import tw from "@/constants/tw";
import {
  cancelProductNotification,
  requestProductNotification,
} from "@/services/api";
import { Product } from "@/services/api/types";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface ProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onNotificationChange?: () => void;
}

export function ProductModal({
  visible,
  product,
  onClose,
  onNotificationChange,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  if (!product) return null;

  const hasNotification = product.userRequestedNotification;
  const modalWidth = Math.min(windowWidth - 32, 400); // Max width 400, with 32px padding

  const handleImageScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / modalWidth);
    setActiveImageIndex(index);
  };

  const handleNotification = async () => {
    setLoading(true);
    try {
      if (hasNotification) {
        await cancelProductNotification(product.id);
        Alert.alert("Success", "Notification request cancelled");
      } else {
        await requestProductNotification(product.id);
        Alert.alert(
          "Success",
          "You'll be notified when this product becomes available!"
        );
      }
      onNotificationChange?.();
      onClose();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <PlatformBlurView
        intensity={10}
        opacity={0.9}
        onTouchEnd={onClose}
        style={tw`flex-1 bg-black/80 justify-center items-center p-4`}
      >
        <PlatformBlurView
          onTouchEnd={(e) => e.stopPropagation()}
          intensity={60}
          style={tw`w-full max-w-md`}
          tint="dark"
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-1 right-2 z-10 rounded-full p-2`}
          >
            <Text style={tw`text-white font-mont-bold text-lg`}>✕</Text>
          </TouchableOpacity>

          <View style={tw` border border-white/10 rounded-md overflow-hidden `}>
            {/* Product Image Carousel */}
            <View style={tw`relative`}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleImageScroll}
              >
                {product.imageUrls.map((imageUrl, index) => (
                  <View
                    key={index}
                    style={[
                      tw`items-center justify-center`,
                      {
                        height: modalWidth,
                        width: modalWidth,
                      }, // Subtract padding
                    ]}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={tw`w-full h-full `}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Pagination Dots */}
              {product.imageUrls.length > 1 && (
                <View
                  style={tw`absolute bottom-3 left-0 right-0 flex-row justify-center items-center gap-1`}
                >
                  {product.imageUrls.map((_, index) => (
                    <View
                      key={index}
                      style={tw`h-[6px] w-[6px] rounded-full ${
                        index === activeImageIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={tw`flex-col p-3 gap-2 `}>
              {/* Product Name and Description */}
              <Text style={tw`text-white font-tussi-bold text-lg text-left`}>
                {product.name}
              </Text>
              <Text style={tw`text-white/70 font-mont text-sm mt-1`}>
                {product.description}
              </Text>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <View style={tw`flex-row flex-wrap gap-2 mt-3 mb-5`}>
                  {product.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={tw`bg-white/10 px-3 py-1 rounded-full`}
                    >
                      <Text style={tw`text-white/80 font-mont text-xs`}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Price */}
              {/* <Text style={tw`text-primary font-mont-medium text-lg mt-3`}>
                ${product.finalCost.toFixed(2)}
              </Text> */}

              {/* Sold Out Label */}
              {/* <View style={tw`mt-4 mb-1`}>
                <View
                  style={tw`bg-red-500/20 border border-red-500 rounded-sm px-4 py-2`}
                >
                  <Text
                    style={tw`text-red-500 font-tussi-bold text-sm text-center`}
                  >
                    SOLD OUT
                  </Text>
                </View>
              </View> */}

              {/* CTA Button */}
              {hasNotification ? (
                <View style={tw`  rounded-sm px-4 py-3`}>
                  <Text
                    style={tw`text-green-500 font-mont-medium text-sm text-center`}
                  >
                    We&apos;ll notify you when this product is back in stock
                  </Text>
                </View>
              ) : (
                <Button
                  title="Notify Me"
                  onPress={handleNotification}
                  loading={loading}
                  style={{ backgroundColor: "#FF5C2A" }}
                />
              )}
            </View>
          </View>
        </PlatformBlurView>
      </PlatformBlurView>
    </Modal>
  );
}
