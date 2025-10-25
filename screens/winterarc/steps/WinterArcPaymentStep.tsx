import { Button } from "@/components/Button";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
    winterArcPurchased,
    selectedPackage,
    isPurchaseLoading,
    isPurchasing,
    purchase,
    restorePurchases,
  } = useGlobalContext();

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
        "Your Winter Arc access has been restored!",
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
      <ScrollView style={tw`flex-1`}>
        <View
          style={tw`flex-col items-center gap-6 bg-white/5 border border-white/5 rounded-md p-1 pt-4 `}
        >
          <Image
            source={require("@/assets/images/society-logo-no-bg.png")}
            style={tw`w-20 h-20 self-center`}
            resizeMode="contain"
          />
          <Text style={tw`text-white font-tussi-bold text-5`}>
            SKIN IN THE GAME
          </Text>
          <Text
            style={tw`text-white/70 font-mont-medium text-base text-center max-w-[350px]  `}
          >
            Pay a redeemable amount of{" "}
            <Text style={tw`text-primary font-mont-medium text-base`}>
              {selectedPackage?.product?.priceString || ""}
            </Text>{" "}
            to keep yourself accountable and start your Winter Arc
          </Text>

          <View
            style={tw`flex-col items-start  gap-2 bg-black/10 p-3 pt-6 pb-10 bg-black border border-white/5 rounded-md`}
          >
            <Text
              style={tw` pl-4  text-white/70 font-tussi-bold text-sm text-center max-w-[300px]`}
            >
              THE RULES
            </Text>
            <View
              style={tw`flex-col items-start gap-2 px-4 max-w-[350px] pt-3`}
            >
              <View style={tw`flex-row items-start gap-3`}>
                <View
                  style={tw`w-[6px] h-[6px] bg-white rounded-full mt-2`}
                ></View>
                <Text
                  style={tw`text-white/80 font-mont-medium text-left text-sm  `}
                >
                  If you complete at least 80% of your rituals, you get your
                  money back.
                </Text>
              </View>
              <View style={tw`flex-row items-start gap-3`}>
                <View
                  style={tw`w-[6px] h-[6px] bg-white rounded-full mt-2`}
                ></View>
                <Text
                  style={tw`text-white/80 font-mont-medium text-left text-sm  `}
                >
                  If you break discipline and fall short, your stake is lost.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={tw`text-white font-tussi text-center px-4 py-10 text-sm`}>
          People are{" "}
          <Text style={tw`text-primary font-mont-bold text-lg`}>3x</Text> more
          likely to finish what they start when something real is at stake.
        </Text>
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
    </View>
  );
}
