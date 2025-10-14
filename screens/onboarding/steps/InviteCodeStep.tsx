import { Colors } from "@/constants/theme";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { submitInviteCode } from "@/services/api/users";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
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
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const glitchOpacity = useRef(new Animated.Value(1)).current;
  const videoRef = useRef<Video>(null);
  const { refetchUserSilently, addNotification } = useGlobalContext();

  // Synchronized glitch and text rotation animation
  useEffect(() => {
    const createNaturalGlitch = () => {
      const glitchSequence = [
        { x: -3, y: 2, opacity: 0.7, duration: 80 },
        { x: 2, y: -1, opacity: 1, duration: 40 },
        { x: -4, y: 3, opacity: 0.5, duration: 60 },
        { x: 0, y: 0, opacity: 1, duration: 30 },
        { x: 5, y: -2, opacity: 0.3, duration: 120 }, // Peak glitch
        { x: -2, y: 1, opacity: 0.8, duration: 50 },
        { x: 0, y: 0, opacity: 1, duration: 100 }, // Return to normal
      ];

      let currentStep = 0;

      const executeGlitchStep = () => {
        if (currentStep < glitchSequence.length) {
          const step = glitchSequence[currentStep];
          setGlitchOffset({ x: step.x, y: step.y });

          Animated.timing(glitchOpacity, {
            toValue: step.opacity,
            duration: step.duration,
            useNativeDriver: true,
          }).start();

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
  }, [fadeAnim, glitchOpacity]);

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

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-32}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 px-3 gap-3`}>
          <View
            style={tw`flex-1  flex flex-col items-center justify-center gap-8`}
          >
            <View
              style={tw`h-[300px] w-[300px] rounded-lg overflow-hidden opacity-50`}
            >
              <Video
                ref={videoRef}
                source={require("@/assets/videos/walking.mp4")}
                style={tw`flex-1 w-full`}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
                isMuted
              />
            </View>
            <Animated.Text
              style={[
                tw`font-tussi text-lg text-center text-white`,
                {
                  opacity: Animated.multiply(fadeAnim, glitchOpacity),
                  transform: [
                    { translateX: glitchOffset.x },
                    { translateY: glitchOffset.y },
                  ],
                },
              ]}
            >
              {PHRASES[currentPhraseIndex]}
            </Animated.Text>
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
