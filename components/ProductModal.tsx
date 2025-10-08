import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import {
  cancelProductNotification,
  requestProductNotification,
} from "@/services/api";
import { Product } from "@/services/api/types";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
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

  if (!product) return null;

  const hasNotification = product.userRequestedNotification;

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
      <BlurView
        intensity={10}
        onTouchEnd={onClose}
        style={tw`flex-1 bg-black/80 justify-center items-center p-4`}
      >
        <BlurView
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

          <View style={tw`p-6 border border-white/10 rounded-md`}>
            {/* Product Image and Name */}
            <View style={tw`items-start mb-6`}>
              <Image
                source={{ uri: product.imageUrl }}
                style={tw`h-24 w-24 rounded-full mb-4`}
                resizeMode="contain"
              />
              <Text style={tw`text-white font-tussi-bold text-lg text-left`}>
                {product.name}
              </Text>
              <Text style={tw`text-white/70 font-mont text-sm mt-1`}>
                {product.description}
              </Text>

              <Text style={tw`text-primary font-mont-medium text-lg mt-3`}>
                ${product.finalCost.toFixed(2)}
              </Text>
            </View>

            {/* Sold Out Label */}
            <View style={tw`mb-4`}>
              <View
                style={tw`bg-red-500/20 border border-red-500 rounded-sm px-4 py-2`}
              >
                <Text
                  style={tw`text-red-500 font-tussi-bold text-sm text-center`}
                >
                  SOLD OUT
                </Text>
              </View>
            </View>

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
        </BlurView>
      </BlurView>
    </Modal>
  );
}
