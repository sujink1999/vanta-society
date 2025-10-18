import { Button } from "@/components/Button";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import {
  checkWinterArcAccess,
  getOfferings,
  purchasePackage,
  restorePurchases,
} from "@/services/revenuecat";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { PurchasesPackage } from "react-native-purchases";

interface WinterArcPaymentStepProps {
  onNext: () => void;
}

export function WinterArcPaymentStep({ onNext }: WinterArcPaymentStepProps) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    setLoading(true);

    // Check if user already has access
    const hasAccess = await checkWinterArcAccess();
    if (hasAccess) {
      // User already has access, skip payment
      onNext();
      return;
    }

    // Load available packages
    const availablePackages = await getOfferings();
    setPackages(availablePackages);

    // Auto-select first package
    if (availablePackages.length > 0) {
      setSelectedPackage(availablePackages[0]);
    }

    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);

    const result = await purchasePackage(selectedPackage);

    setPurchasing(false);

    if (result.success) {
      // Purchase successful, move to next step
      const amount = selectedPackage?.product.priceString || "your payment";
      Alert.alert(
        "🎉 You're In!",
        `Your commitment is locked. Complete 80%+ of your rituals over 66 days and ${amount} is fully redeemable. Let's set up your challenge!`,
        [{ text: "Let's Go", onPress: onNext }]
      );
    } else if (!result.error?.userCancelled) {
      Alert.alert(
        "Purchase Failed",
        "There was a problem completing your purchase. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);

    try {
      await restorePurchases();
      const hasAccess = await checkWinterArcAccess();

      setPurchasing(false);

      if (hasAccess) {
        Alert.alert(
          "✅ Purchase Restored",
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
    } catch (error) {
      setPurchasing(false);
      Alert.alert(
        "Restore Failed",
        "There was a problem restoring your purchase. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center px-3 pt-8 pb-6`}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={tw`text-textSecondary font-mont mt-4`}>
          Loading payment options...
        </Text>
      </View>
    );
  }

  // if (packages.length === 0) {
  //   return (
  //     <View style={tw`flex-1 px-3 pt-8 pb-6`}>
  //       <View style={tw`flex-1 justify-center items-center`}>
  //         <GradientText
  //           style={tw`text-textPrimary text-center font-tussi-bold text-5xl mb-4`}
  //         >
  //           COMING SOON
  //         </GradientText>
  //         <Text style={tw`text-textSecondary font-mont text-base text-center max-w-[300px]`}>
  //           Winter Arc enrollment will be available soon. Check back later!
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View style={tw`flex-1 flex-col justify-between px-3 pt-8 pb-[60px]`}>
      <Image
        source={require("@/assets/images/society-logo-no-bg.png")}
        style={tw`w-20 h-20 self-center`}
        resizeMode="contain"
      />

      <View style={tw`flex-col items-center gap-6 bg-white rounded-md pt-10 `}>
        <Text style={tw`text-black font-tussi-bold text-5`}>
          SKIN IN THE GAME
        </Text>
        <Text
          style={tw`text-black/70 font-mont-semibold text-base text-center max-w-[350px]`}
        >
          Pay{" "}
          <Text style={tw`text-primary font-mont-bold text-base`}>$24.99</Text>{" "}
          to keep yourself accountable and start your Winter Arc.
        </Text>

        <View
          style={tw`flex-col items-start  gap-2 bg-black/10 mt-6 p-3 pb-10`}
        >
          <Text
            style={tw` pl-4 text-black font-tussi-bold text-base text-center max-w-[300px]`}
          >
            THE RULES
          </Text>
          <View style={tw`flex-col items-start gap-2 px-4 max-w-[350px] mt-3`}>
            <View style={tw`flex-row items-start gap-3`}>
              <View
                style={tw`w-[6px] h-[6px] bg-black rounded-full mt-2`}
              ></View>
              <Text
                style={tw`text-black/80 font-mont-semibold text-left text-sm  `}
              >
                If you complete at least 80% of your rituals, you get your money
                back.
              </Text>
            </View>
            <View style={tw`flex-row items-start gap-3`}>
              <View
                style={tw`w-[6px] h-[6px] bg-black rounded-full mt-2`}
              ></View>
              <Text
                style={tw`text-black/80 font-mont-semibold text-left text-sm  `}
              >
                If you break discipline and fall short, your stake is lost.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={tw`text-white font-tussi-bold text-sm text-center mt-6`}>
        People are{" "}
        <Text style={tw`text-primary font-mont-bold text-lg`}>3x</Text> more
        likely to finish what they start when something real is at stake.
      </Text>

      {/* Purchase Button */}
      <View style={tw`mt-4`}>
        <Button
          title={purchasing ? "PROCESSING..." : "PAY $24.99"}
          onPress={handlePurchase}
          // disabled={!selectedPackage || purchasing}
          loading={purchasing}
          textStyle={tw`font-tussi`}
        />
      </View>

      {/* Loading Overlay */}
      {purchasing && (
        <View
          style={tw`absolute inset-0 bg-black/70 justify-center items-center`}
          pointerEvents="box-none"
        >
          <View style={tw`bg-black/90 rounded-2xl p-8 items-center`}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={tw`text-textPrimary mt-4 font-mont`}>
              Processing payment...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
