import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { PhoneNumberInput } from "@/components/PhoneNumberInput";
import { RadioButton } from "@/components/RadioButton";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { completeProfile } from "@/services/api/users";
import React, { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";

interface DetailsStepProps {
  onNext: () => void;
}

export function DetailsStep({ onNext }: DetailsStepProps) {
  const { user, refetchUserSilently } = useGlobalContext();
  const [details, setDetails] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    instagramHandle: user?.instagramHandle || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    countryCode: user?.countryCode || "+91",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !details.firstName.trim() ||
      !details.lastName.trim() ||
      !details.instagramHandle.trim() ||
      !details.gender
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await completeProfile({
        firstName: details.firstName.trim(),
        lastName: details.lastName.trim(),
        instagramHandle: details.instagramHandle.trim(),
        gender: details.gender,
        phone: details.phone.trim() || undefined,
        countryCode: details.countryCode,
      });

      if (response.success) {
        await refetchUserSilently(); // Update user context
        onNext();
      } else {
        Alert.alert("Error", "Failed to save profile. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1`} contentContainerStyle={tw`px-6 py-8`}>
      <View style={tw` flex flex-col items-center`}>
        {/* <Text  */}
        <GradientText
          style={tw`text-textPrimary text-center font-tussi-bold text-6`}
        >
          DETAILS
        </GradientText>
      </View>

      <View style={tw`mb-4 mt-20`}>
        <TextInput
          style={tw`border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-md`}
          value={details.firstName}
          onChangeText={(text) =>
            setDetails((prev) => ({ ...prev, firstName: text }))
          }
          placeholder="First Name"
          placeholderTextColor="#666"
          autoCapitalize="words"
        />
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-md`}
          value={details.lastName}
          onChangeText={(text) =>
            setDetails((prev) => ({ ...prev, lastName: text }))
          }
          placeholder="Last Name"
          placeholderTextColor="#666"
          autoCapitalize="words"
        />
      </View>

      <View style={tw`mb-4`}>
        <RadioButton
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Non-binary", value: "non-binary" },
          ]}
          selectedValue={details.gender}
          onValueChange={(value) =>
            setDetails((prev) => ({ ...prev, gender: value }))
          }
        />
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-md`}
          value={details.instagramHandle}
          onChangeText={(text) =>
            setDetails((prev) => ({ ...prev, instagramHandle: text }))
          }
          placeholder="IG handle (without @)"
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={tw`mb-12`}>
        <PhoneNumberInput
          value={details.phone}
          onChangeText={(text) =>
            setDetails((prev) => ({ ...prev, phone: text }))
          }
          countryCode={
            details.countryCode.startsWith("+")
              ? details.countryCode.substring(1)
              : details.countryCode
          }
          onCountryChange={(_, dialCode) => {
            console.log("dialCode", dialCode);
            setDetails((prev) => ({ ...prev, countryCode: dialCode }));
          }}
          placeholder="Phone number (optional)"
        />
      </View>
      <Button
        title="ready to OUTLIVE ORDINARY"
        onPress={handleSubmit}
        disabled={
          !details.firstName.trim() ||
          !details.lastName.trim() ||
          !details.instagramHandle.trim() ||
          !details.gender
        }
        loading={isLoading}
      />
    </ScrollView>
  );
}
