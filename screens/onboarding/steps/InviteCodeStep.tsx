import { Button } from "@/components/Button";
import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { submitInviteCode } from "@/services/api/users";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, TextInput, View } from "react-native";

interface InviteCodeStepProps {
  onNext: () => void;
}

const PHRASES = [
  "OUTLIVE ORDINARY",
  "IDENTITY > MOTIVATION",
  "DISCIPLINE IS SEXY",
  "NOBODY EXCAPES ALONE",
  "DATA IS TRUTH",
  "TOGETHER WE'RE STRONGER",
];

export function InviteCodeStep({ onNext }: InviteCodeStepProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0); // 0 = normal, 1 = light gray, 2 = medium gray, 3 = white
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { refetchUserSilently } = useGlobalContext();

  // Synchronized glitch and text rotation animation
  useEffect(() => {
    const createNaturalGlitch = () => {
      const glitchSequence = [
        { intensity: 1, duration: 80 }, // Light gray
        { intensity: 0, duration: 40 }, // Normal
        { intensity: 2, duration: 60 }, // Medium gray
        { intensity: 0, duration: 30 }, // Normal
        { intensity: 3, duration: 120 }, // White (peak)
        { intensity: 1, duration: 50 }, // Light gray
        { intensity: 0, duration: 100 }, // Normal (end)
      ];

      let currentStep = 0;

      const executeGlitchStep = () => {
        if (currentStep < glitchSequence.length) {
          const step = glitchSequence[currentStep];
          setGlitchIntensity(step.intensity);

          setTimeout(() => {
            currentStep++;
            executeGlitchStep();
          }, step.duration);
        }
      };

      executeGlitchStep();
    };

    const syncedAnimation = () => {
      // Start natural glitch sequence
      createNaturalGlitch();

      // Fade out text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        // Change text while faded out
        setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length);

        // Fade text back in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    };

    let animationInterval: any;
    // Initial delay, then repeat
    const initialDelay = setTimeout(() => {
      syncedAnimation();

      animationInterval = setInterval(() => {
        syncedAnimation();
      }, 4000);
      return () => clearInterval(animationInterval);
    }, 4000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(animationInterval);
    };
  }, [fadeAnim]);

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter an invite code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await submitInviteCode({
        referrerInviteCode: inviteCode.trim(),
      });

      if (response.success) {
        await refetchUserSilently(); // Update user context
        onNext();
      } else {
        Alert.alert(
          "Invalid Code",
          "The invite code you entered is not valid."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify invite code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getGlitchStyle = () => {
    switch (glitchIntensity) {
      case 1:
        return { backgroundColor: "rgba(64, 64, 64, 0.3)" }; // Light gray
      case 2:
        return { backgroundColor: "rgba(128, 128, 128, 0.4)" }; // Medium gray
      case 3:
        return { backgroundColor: "rgba(255, 255, 255, 0.7)" }; // White
      default:
        return {}; // Normal (black)
    }
  };

  const getTextColor = () => {
    switch (glitchIntensity) {
      case 3:
        return "black"; // White background = black text
      case 2:
        return "lightgray"; // Medium gray = light gray text
      default:
        return "white"; // Normal/light gray = white text
    }
  };

  const getBoxStyle = () => {
    switch (glitchIntensity) {
      case 1:
        return tw`bg-white/20`;
      case 2:
        return tw`bg-white/40`;
      case 3:
        return tw`bg-black/20`;
      default:
        return tw`bg-white/10`;
    }
  };

  return (
    <View style={[tw`flex-1 px-3 gap-3`, getGlitchStyle()]}>
      <View style={tw`flex-1  flex flex-col items-center justify-center gap-8`}>
        <View
          style={[
            tw`h-[300px] w-40 rounded-lg`,
            // getBoxStyle(),
          ]}
        ></View>
        <Animated.Text
          style={[
            tw`font-tussi text-lg text-center`,
            {
              opacity: fadeAnim,
              color: getTextColor(),
            },
          ]}
        >
          {PHRASES[currentPhraseIndex]}
        </Animated.Text>
      </View>
      <View style={tw`flex flex-col gap-5 mb-20`}>
        <TextInput
          style={tw` border border-white/20 rounded-sm px-4 py-3  text-white font-tussi text-md text-left `}
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="Enter invite code"
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          textAlign="left"
        />

        <View style={tw` h-10 `}>
          {inviteCode.trim()?.length > 4 && (
            <Button
              title="Continue"
              onPress={handleSubmit}
              disabled={!inviteCode.trim()}
              loading={isLoading}
            />
          )}
        </View>
      </View>
    </View>
  );
}
