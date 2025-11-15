import { Button } from "@/components/Button";
import { InfoIcon } from "@/components/icons/Icons";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WinterArcPaymentStepProps {
  onNext: () => void;
}

export function WinterArcPaymentStep({ onNext }: WinterArcPaymentStepProps) {
  const {
    user,
    winterArcPurchased,
    selectedPackage,
    isPurchaseLoading,
    isPurchasing,
    purchase,
    restorePurchases,
  } = useGlobalContext();
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  // Default copy (fallback if backend doesn't provide)
  const defaultCopy = {
    title: "PROJECT66 PASS",
    subtitle: [
      { text: "Purchase your Project66 Pass for ", type: "text" as const },
      { text: "", type: "amount" as const },
      {
        text: ", show up daily, and unlock Store Credits when you finish strong.",
        type: "text" as const,
      },
    ],
    rules: [
      "Complete 80%+ of your daily rituals",
      "Stay consistent through all 66 days",
      "Verified completion unlocks Arc Credits",
    ],
    questionCta: "What are Store Credits?",
    disclaimerIos:
      "Store Credits have no cash value and cannot be withdrawn or exchanged for money. Reward availability may vary. One-time digital access purchase. Restore anytime in Settings. Purchases are processed through Apple's App Store and subject to Apple's refund policy. To request a refund, contact Apple Support. Apple is not a sponsor and is not involved in the Project66 challenge.",
    disclaimerAndroid:
      "Store Credits have no cash value and cannot be withdrawn or exchanged for money. Reward availability may vary. One-time digital access purchase. Restore anytime in Settings. Purchases are processed through Google Play Store and subject to Google's refund policy. To request a refund, contact Google Play Support. Google is not a sponsor and is not involved in the Project66 challenge.",
    popupTitle: "WHAT ARE STORE CREDITS?",
    popupPoints: [
      "Store Credits are points you earn by successfully completing Project66.",
      "Redeem them for future Arc access or curated Vanta rewards like premium merch.",
    ],
    popupDisclaimer:
      "Credits have no cash value. Reward options may change over time.",
  };

  const copy = user?.arcPassCopy || defaultCopy;

  useEffect(() => {
    // Check if user already has access
    if (winterArcPurchased) {
      onNext();
    }
  }, [winterArcPurchased, onNext]);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    await purchase();
  };

  const handleRestore = async () => {
    const result = await restorePurchases();

    if (result.success) {
      Alert.alert(
        "Purchase Restored",
        "Your Project66 access has been restored!",
        [{ text: "Continue", onPress: onNext }]
      );
    } else {
      Alert.alert(
        "No Purchase Found",
        "We couldn't find any previous purchases to restore.",
        [{ text: "OK" }]
      );
    }
  };

  if (isPurchaseLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center px-3 pt-8 pb-6`}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={tw`text-textSecondary font-mont mt-4`}>
          Loading payment options...
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 flex-col px-3 pt-3 pb-6`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View
          style={tw`flex-col items-center gap-6 bg-white/5 border border-white/5 rounded-md p-1 pt-4 `}
        >
          <Image
            source={require("@/assets/images/society-logo-no-bg.png")}
            style={tw`w-20 h-20 self-center`}
            resizeMode="contain"
          />
          <Text style={tw`text-white font-tussi-bold text-5`}>
            {copy.title}
          </Text>
          <Text
            style={tw`text-white/70 font-mont-medium text-sm text-center max-w-[350px] px-2`}
          >
            {copy.subtitle.map((segment, index) => {
              if (segment.type === "amount") {
                return (
                  <Text
                    key={index}
                    style={tw`text-primary font-mont-semibold text-sm`}
                  >
                    {selectedPackage?.product?.priceString || ""}
                  </Text>
                );
              } else if (segment.type === "primaryText") {
                return (
                  <Text
                    key={index}
                    style={tw`text-primary font-mont-semibold text-sm`}
                  >
                    {segment.text}
                  </Text>
                );
              } else {
                return <Text key={index}>{segment.text}</Text>;
              }
            })}
          </Text>

          <View style={tw`flex-col`}>
            <View
              style={tw`flex-col items-start gap-2 bg-black/10 p-3 pt-6 pb-6 bg-black border border-white/5 rounded-md w-full`}
            >
              <Text
                style={tw`pl-4 text-white/70 font-tussi-bold text-sm max-w-[300px]`}
              >
                THE RULES
              </Text>
              <View
                style={tw`flex-col items-start gap-2 px-4 max-w-[350px] pt-3`}
              >
                {copy.rules.map((rule, index) => (
                  <View key={index} style={tw`flex-row items-start gap-3`}>
                    <View
                      style={tw`w-[6px] h-[6px] bg-white rounded-full mt-2`}
                    ></View>
                    <Text
                      style={tw`text-white/80 font-mont-medium text-left text-sm`}
                    >
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={tw`flex-row items-center justify-end gap-1.5 p-2 pt-4`}
              onPress={() => setShowCreditsModal(true)}
            >
              <InfoIcon size={14} color="white" />
              <Text style={tw`text-white font-mont-medium text-xs`}>
                {copy.questionCta}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimers */}
          <View style={tw`px-3 pb-4`}>
            <Text
              style={tw`text-white/40 font-mont text-xs text-center leading-5`}
            >
              {Platform.OS === "ios"
                ? copy.disclaimerIos
                : copy.disclaimerAndroid}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={tw` flex-col gap-4`}>
        <Button
          title={isPurchasing ? "PROCESSING..." : `CONTINUE`}
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
          loading={isPurchasing}
        />
        <TouchableOpacity onPress={handleRestore}>
          <Text style={tw`text-white/70 text-xs font-tussi  text-center`}>
            Restore Purchase
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {isPurchasing && (
        <PlatformBlurView
          intensity={10}
          opacity={0.8}
          tint="dark"
          style={tw`absolute inset-0 overflow-hidden`}
        >
          <View
            style={tw`absolute inset-0 bg-black/70 justify-center items-center`}
            pointerEvents="box-none"
          >
            <PlatformBlurView
              intensity={60}
              style={tw` rounded-md p-8 items-center border border-white/10 overflow-hidden`}
            >
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={tw`text-textPrimary mt-4 font-tussi`}>
                Processing payment...
              </Text>
            </PlatformBlurView>
          </View>
        </PlatformBlurView>
      )}

      {/* Arc Credits Info Modal */}
      <Modal
        visible={showCreditsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreditsModal(false)}
      >
        <View style={tw`flex-1 bg-black/80 justify-center items-center px-4`}>
          <PlatformBlurView
            intensity={40}
            style={tw`w-full max-w-md border border-white/10 rounded-lg overflow-hidden`}
            tint="dark"
          >
            <View style={tw`p-3 pt-6`}>
              <Text
                style={tw`text-white font-tussi-bold text-base mb-4 text-center`}
              >
                {copy.popupTitle}
              </Text>

              <View style={tw`mb-6 gap-1 px-3`}>
                {copy.popupPoints.map((point, index) => (
                  <View key={index} style={tw`flex-row items-start gap-3`}>
                    <View
                      style={tw`w-[6px] h-[6px] bg-white/80 rounded-full mt-[10px]`}
                    ></View>
                    <Text
                      key={index}
                      style={tw`text-white/80 font-mont text-sm leading-6`}
                    >
                      {point}
                    </Text>
                  </View>
                ))}
                <Text
                  style={tw`text-white/60 font-mont text-xs leading-5 mt-6`}
                >
                  {copy.popupDisclaimer}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowCreditsModal(false)}
                style={tw`bg-primary py-3 px-6`}
              >
                <Text style={tw`text-white font-tussi-bold text-center`}>
                  GOT IT
                </Text>
              </TouchableOpacity>
            </View>
          </PlatformBlurView>
        </View>
      </Modal>
    </View>
  );
}
