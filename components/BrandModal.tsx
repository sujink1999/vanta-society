import { Button } from "@/components/Button";
import { CheckIcon, CopyIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { MarketplaceItem } from "@/services/api/types";
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BrandModalProps {
  visible: boolean;
  brand: MarketplaceItem | null;
  onClose: () => void;
}

export function BrandModal({ visible, brand, onClose }: BrandModalProps) {
  const [copied, setCopied] = useState(false);

  if (!brand) return null;

  const hasDiscountCode = !!brand.discountCode;

  const handleCopyCode = async () => {
    if (brand.discountCode) {
      await Clipboard.setStringAsync(brand.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVisitBrand = async () => {
    try {
      const canOpen = await Linking.canOpenURL(brand.redirectUrl);
      if (canOpen) {
        await Linking.openURL(brand.redirectUrl);
      } else {
        console.error("Cannot open URL:", brand.redirectUrl);
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
      Alert.alert("Error", "Failed to open brand website");
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
          style={tw` w-full max-w-md `}
          tint="dark"
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-1 right-2 z-10 rounded-full p-2`}
          >
            <Text style={tw`text-white font-mont-bold text-lg`}>✕</Text>
          </TouchableOpacity>

          <View style={tw`p-4 border border-white/10 rounded-md `}>
            {/* Brand Image and Name */}
            <View style={tw`items-start mb-6`}>
              <Image
                source={{ uri: brand.imageUrl }}
                style={tw`h-24 w-24  mb-4`}
                resizeMode="contain"
              />
              <Text style={tw`text-white font-tussi-bold text-lg text-left`}>
                {brand.companyName}
              </Text>
              <Text style={tw`text-white/70 font-mont text-sm  mt-1`}>
                {brand.description}
              </Text>
            </View>

            {/* Discount Code Section */}
            {hasDiscountCode && (
              <View style={tw`mb-6 flex-col gap-2`}>
                <View
                  style={tw`bg-white/5 border border-white/20 rounded-sm pl-4 pr-2 py-1`}
                >
                  <View style={tw`flex-row items-center justify-between `}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-white font-tussi text-base`}>
                        {brand.discountCode}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={handleCopyCode} style={tw`p-2`}>
                      {copied ? (
                        <CheckIcon size={20} color="#22c55e" />
                      ) : (
                        <CopyIcon size={20} color="white" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={tw`text-white/70 font-mont text-xs`}>
                  use the above code while checkout to avail{" "}
                  {brand.discountPercentage}% off
                </Text>
              </View>
            )}

            {/* CTA Button */}
            <Button
              title={`Visit ${brand.companyName}`}
              onPress={handleVisitBrand}
              style={{ backgroundColor: "#FF5C2A" }}
            />
          </View>
        </BlurView>
      </BlurView>
    </Modal>
  );
}
