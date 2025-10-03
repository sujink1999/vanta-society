import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText";
import { BenefitCard } from "@/components/winterarc/BenefitCard";
import { CitationCardWithImage } from "@/components/winterarc/CitationCardWithImage";
import tw from "@/constants/tw";
import React from "react";
import { ScrollView, Text, View } from "react-native";

interface WinterArcInfoStepProps {
  onNext: () => void;
}

const benefitCards = [
  { title: "Boost Energy", percentage: "38%" },
  { title: "Reduce Fatigue", percentage: "15%" },
  { title: "Gain Muscle Strength", percentage: "23%" },
  { title: "Improve Mobility", percentage: "20%" },
];

const citations = [
  {
    citation:
      "Habits form through repeated actions in stable contexts, taking weeks to months to become automatic.",
    reference:
      "Wood, W. & Rünger, D. (2016). Psychology of Habit. Annual Review of Psychology.",
    imageSource: require("@/assets/images/research/psychology-of-habit.png"),
  },
  {
    citation:
      "On average, it takes more than two months before a new behavior becomes automatic",
    reference:
      "Clear, J. (2018). Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones. Avery.",
    imageSource: require("@/assets/images/research/atomic-habits.jpg"),
  },
  {
    citation:
      "96 participants performed a daily behavior, and automaticity was modeled to plateau at an average of 66 days, with a range of 18-254 days.",
    reference:
      "Lally, P., et al. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology.",
    imageSource: require("@/assets/images/research/ucl.jpg"),
  },
];

export function WinterArcInfoStep({ onNext }: WinterArcInfoStepProps) {
  const handleNext = () => {
    onNext();
  };

  return (
    <View style={tw`flex-1 px-3 py-6`}>
      <View style={tw`flex-1 `}>
        <ScrollView style={tw`flex-1`}>
          {/* 66 Days Section */}

          <View style={tw`flex-col items-center gap-8`}>
            <View style={tw`flex-col items-center gap-3  `}>
              <Text
                style={tw`text-base font-mont-medium text-white/80 text-center `}
              >
                Top scientific research shows it takes
              </Text>
              <GradientText
                style={tw`text-4xl font-tussi-bold text-white text-center `}
              >
                75 Days
              </GradientText>
              <Text
                style={tw`text-base font-mont-medium text-white/80 text-center `}
              >
                to form lasting habits and{" "}
                <Text style={tw`text-primary `}>transform your life.</Text>
              </Text>
            </View>
            <View style={tw`flex-col w-full gap-2 mt-2`}>
              <View style={tw`flex-row gap-2`}>
                <BenefitCard
                  title={benefitCards[0].title}
                  percentage={benefitCards[0].percentage}
                  icon="↑"
                />

                <BenefitCard
                  title={benefitCards[1].title}
                  percentage={benefitCards[1].percentage}
                  icon="↑"
                />
              </View>
              <View style={tw`flex-row gap-2`}>
                <BenefitCard
                  title={benefitCards[2].title}
                  percentage={benefitCards[2].percentage}
                  icon="↑"
                />

                <BenefitCard
                  title={benefitCards[3].title}
                  percentage={benefitCards[3].percentage}
                  icon="↑"
                />
              </View>
              <View style={tw`flex-col items-center gap-3   rounded-md p-4 `}>
                <Text
                  style={tw`text-base font-mont-medium text-white/80 text-center `}
                >
                  Vanta uses <Text style={tw`text-primary `}>AI</Text> and{" "}
                  <Text style={tw`text-primary `}>science</Text> to build your
                  Winter Arc Routine
                </Text>
              </View>
            </View>

            {/* Science-Backed Research Section */}
            <Text
              style={tw`text-base font-tussi text-white text-center mt-8 -mb-4 `}
            >
              Science-Backed Approach
            </Text>

            <View style={tw`flex-col gap-2 w-full`}>
              {citations.map((citation, index) => (
                <CitationCardWithImage
                  key={index}
                  citation={citation.citation}
                  reference={citation.reference}
                  imageSource={citation.imageSource}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <Button title="GET ROUTINE" onPress={handleNext} />
    </View>
  );
}
