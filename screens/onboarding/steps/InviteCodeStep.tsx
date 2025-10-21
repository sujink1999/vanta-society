import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { submitInviteCode } from "@/services/api/users";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
  const { refetchUserSilently, addNotification } = useGlobalContext();

  const player = useVideoPlayer(require("@/assets/videos/walking.mp4"), (player) => {
    player.muted = true;
    player.loop = true;
    player.play();
  });

  // Cleanup video player on unmount
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

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
      }, 3000);
      return () => clearInterval(animationInterval);
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(animationInterval);
    };
  }, [fadeAnim]);

  const handleSubmit = async () => {
    if (!inviteCode.trim()) {
      addNotification("Please enter an invite code", "error", 3000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await submitInviteCode({
        referrerInviteCode: inviteCode.trim(),
      });

      if (response.success) {
        await refetchUserSilently(); // useEffect will handle navigation
      } else {
        addNotification(
          "The invite code you entered is not valid.",
          "error",
          3000
        );
      }
    } catch (error) {
      addNotification(
        "The invite code you entered is not valid.",
        "error",
        3000
      );
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

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-32}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[tw`flex-1 px-3 gap-3`]}>
          <View
            style={tw`flex-1  flex flex-col items-center justify-center gap-8`}
          >
            <View style={tw`h-[300px] w-[300px] overflow-hidden opacity-50`}>
              <VideoView
                player={player}
                style={tw`flex-1 w-full`}
                contentFit="contain"
                nativeControls={false}
              />
            </View>

            <View style={getGlitchStyle()}>
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
          </View>
          <View style={tw`flex flex-col gap-5 mb-10`}>
            <View style={tw`flex-row items-end gap-2`}>
              <TextInput
                style={tw`flex-1 border border-white/20 rounded-sm px-4 py-3 text-white font-tussi text-md text-left`}
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="Enter invite code"
                placeholderTextColor={Colors.textSecondary}
                autoCapitalize="characters"
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                maxLength={8}
                textAlign="left"
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (inviteCode.trim()) {
                    handleSubmit();
                  }
                }}
                editable={!isLoading}
              />
              {inviteCode.trim() && (
                <TouchableOpacity
                  style={tw`w-12 h-[42px] rounded-sm items-center justify-center bg-primary`}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
