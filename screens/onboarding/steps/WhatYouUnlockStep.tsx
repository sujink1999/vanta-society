import profile from "@/assets/images/screenshots/profile.png";
import rituals from "@/assets/images/screenshots/rituals.png";
import tools from "@/assets/images/screenshots/tools.png";
import { Button } from "@/components/Button";
import tw from "@/constants/tw";
import React, { useRef, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface WhatYouUnlockStepProps {
  onNext: () => void;
}

const CAROUSEL_ITEMS = [
  {
    screenShot: rituals,
    title: "TRACK YOUR RITUALS",
    subtext:
      "Choose the habits and protocols that define your transformation. \nMove, Eat, Rest, Grow, and lock them into your daily arc.",
  },
  {
    screenShot: tools,
    title: "ACTIVATE YOUR TOOLS",
    subtext:
      "Access the Society marketplace, calculators, and longevity protocols. \nEverything you need to sustain discipline, at your fingertips.",
  },
  {
    screenShot: profile,
    title: "YOUR WINTER ARC",
    subtext:
      "Make the most of your Winter Arc.\n All you need is 66 days to transform your life.",
  },
];

export function WhatYouUnlockStep({ onNext }: WhatYouUnlockStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const itemWidth = screenWidth - 48; // Account for padding
    const index = Math.round(contentOffset / itemWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={tw`flex-1 px-6 pt-8 pb-6`}>
      {/* Title */}
      <View style={tw`mb-8`}>
        <Text style={tw`text-sm font-tussi-bold text-white text-center mb-4`}>
          WHAT YOU <Text style={tw`text-primary`}>UNLOCK</Text>
        </Text>
      </View>

      {/* Carousel */}
      <View style={tw` mt-8`}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={tw`items-center`}
        >
          {CAROUSEL_ITEMS.map((item, index) => (
            <View
              key={index}
              style={[
                tw`items-center justify-center px-6`,
                { width: screenWidth - 48 },
              ]}
            >
              {/* Image placeholder */}
              <View
                style={tw`w-[220px] items-center bg-black h-[300px] border-2 border-white/10  rounded-lg overflow-hidden mb-8 justify-start`}
              >
                <Image
                  source={item.screenShot}
                  style={[
                    tw`rounded-lg overflow-hidden`,
                    {
                      width: 200,
                      height: 450,
                      position: "absolute",
                      top: -30,
                      left: 8,
                    },
                  ]}
                  resizeMode="cover"
                />
              </View>

              {/* Title */}
              <Text style={tw`text-white font-tussi text-sm text-center mb-4`}>
                {item.title}
              </Text>

              {/* Subtext */}
              <View style={tw` flex flex-col gap-2 `}>
                {item.subtext.split("\n").map((line, lineIndex) => (
                  <Text
                    key={lineIndex}
                    style={tw`text-textSecondary font-mont text-[13px] text-center`}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots indicator */}
        <View style={tw`flex-row justify-center mt-10`}>
          {CAROUSEL_ITEMS.map((_, index) => (
            <View
              key={index}
              style={[
                tw`w-[6px] h-[6px] rounded-full mx-[2px]`,
                currentIndex === index ? tw`bg-white` : tw`bg-white/20`,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={tw`flex-2`} />

      {/* Button */}
      <Button title="CONTINUE" onPress={onNext} />
    </View>
  );
}
