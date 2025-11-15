import { Button } from "@/components/Button";
import { PhoneModal } from "@/components/PhoneModal";
import { PlatformBlurView } from "@/components/PlatformBlurView";
import { SafeAreaBackground } from "@/components/SafeAreaBackground";
import { ChevronLeftIcon } from "@/components/icons/Icons";
import tw from "@/constants/tw";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";

type UnitSystem = "imperial" | "metric";
type Gender = "male" | "female";
type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

interface CalculationResults {
  bmr: number;
  tdee: number;
  weightPlans: {
    extremeLoss: number;
    loss: number;
    mildLoss: number;
    maintain: number;
    mildGain: number;
    gain: number;
    extremeGain: number;
  };
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const ACTIVITY_LABELS = {
  sedentary: "Sedentary (little or no exercise)",
  lightly_active: "Lightly active (1-3 days/week)",
  moderately_active: "Moderately active (3-5 days/week)",
  very_active: "Very active (6-7 days/week)",
  extra_active: "Extra active (very hard exercise)",
};

// SVG Icon Components
const WeightLossIcon = ({ size = 20, color = "#FF5C2A" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10L12 15L17 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 4V15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 20H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MaintainIcon = ({ size = 20, color = "#4CAF50" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="5"
      y1="8"
      x2="8"
      y2="8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="8"
      x2="19"
      y2="8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="5"
      y1="16"
      x2="8"
      y2="16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="16"
      x2="19"
      y2="16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const WeightGainIcon = ({ size = 20, color = "#2196F3" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 14L12 9L17 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20V9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5 4H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function CalorieCalculatorScreen() {
  const router = useRouter();
  const { user } = useGlobalContext();

  // Form state
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("imperial");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>("sedentary");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Pre-populate with user data if available
  useEffect(() => {
    if (user?.physicalStats) {
      const stats = user.physicalStats;
      if (stats.age) setAge(stats.age.toString());
      if (stats.weight) setWeight(stats.weight.toString());
      if (stats.height) {
        if (unitSystem === "metric") {
          setHeightCm(stats.height.toString());
        } else {
          const totalInches = stats.height / 2.54;
          const feet = Math.floor(totalInches / 12);
          const inches = Math.round(totalInches % 12);
          setHeightFeet(feet.toString());
          setHeightInches(inches.toString());
        }
      }
    }
    if (user?.gender) {
      setGender(user.gender as Gender);
    }
  }, [user, unitSystem]);

  // Unit conversion functions
  const convertWeightToKg = (value: string): number => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;
    return unitSystem === "metric" ? numValue : numValue / 2.20462;
  };

  const convertHeightToCm = (): number => {
    if (unitSystem === "metric") {
      return parseFloat(heightCm) || 0;
    } else {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      return feet * 30.48 + inches * 2.54;
    }
  };

  // Toggle unit system and convert values
  const toggleUnitSystem = () => {
    if (unitSystem === "imperial") {
      // Convert to metric
      if (weight) {
        const kg = (parseFloat(weight) / 2.20462).toFixed(1);
        setWeight(kg);
      }
      if (heightFeet || heightInches) {
        const totalCm = convertHeightToCm();
        setHeightCm(totalCm.toFixed(0));
      }
      setUnitSystem("metric");
    } else {
      // Convert to imperial
      if (weight) {
        const lbs = (parseFloat(weight) * 2.20462).toFixed(0);
        setWeight(lbs);
      }
      if (heightCm) {
        const totalInches = parseFloat(heightCm) / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
      }
      setUnitSystem("imperial");
    }
  };

  // Calculate BMR using Mifflin-St Jeor equation
  const calculateBMR = (): number => {
    const weightKg = convertWeightToKg(weight);
    const heightCm = convertHeightToCm();
    const ageNum = parseInt(age);

    if (!weightKg || !heightCm || !ageNum) return 0;

    if (gender === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }
  };

  // Validate inputs
  const validateInputs = (): boolean => {
    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 15 || ageNum > 120) {
      alert("Please enter a valid age between 15 and 120");
      return false;
    }

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum < 20 || weightNum > 500) {
      alert(`Please enter a valid weight`);
      return false;
    }

    const heightCmValue = convertHeightToCm();
    if (!heightCmValue || heightCmValue < 100 || heightCmValue > 250) {
      alert("Please enter a valid height");
      return false;
    }

    return true;
  };

  // Handle calculation
  const handleCalculate = () => {
    if (!validateInputs()) return;

    setIsCalculating(true);

    // Calculate BMR and TDEE
    const bmr = calculateBMR();
    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    // Calculate weight management plans
    const weightPlans = {
      extremeLoss: tdee - 1000, // Lose 2 lbs/week
      loss: tdee - 500, // Lose 1 lb/week
      mildLoss: tdee - 250, // Lose 0.5 lb/week
      maintain: tdee, // Maintain weight
      mildGain: tdee + 250, // Gain 0.5 lb/week
      gain: tdee + 500, // Gain 1 lb/week
      extremeGain: tdee + 1000, // Gain 2 lbs/week
    };

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightPlans: {
        extremeLoss: Math.round(weightPlans.extremeLoss),
        loss: Math.round(weightPlans.loss),
        mildLoss: Math.round(weightPlans.mildLoss),
        maintain: Math.round(weightPlans.maintain),
        mildGain: Math.round(weightPlans.mildGain),
        gain: Math.round(weightPlans.gain),
        extremeGain: Math.round(weightPlans.extremeGain),
      },
    });

    setIsCalculating(false);
    setShowResultsModal(true);
  };

  return (
    <SafeAreaBackground
      imageSource={require("@/assets/images/backgrounds/tools-bg.png")}
      blurRadius={10}
    >
      <View style={tw`flex-1`}>
        {/* Fixed Header */}
        <View style={tw`flex-row items-center justify-between px-4 py-4`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`p-2 bg-white/5 border border-white/5 rounded-md`}
          >
            <ChevronLeftIcon size={20} color="white" />
          </TouchableOpacity>

          <Text style={tw`text-white font-tussi-bold text-lg`}>
            Calorie Calculator
          </Text>

          <View style={tw`w-9`} />
        </View>

        {/* Scrollable Form Content */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-4`}
          showsVerticalScrollIndicator={false}
        >
          {/* Unit System Toggle */}
          <View style={tw`px-4 mb-4`}>
            <Text style={tw`text-white/70 font-mont text-xs mb-2`}>
              Unit System
            </Text>
            <View
              style={tw`flex-row gap-2 bg-white/5 p-1 rounded-lg border border-white/10`}
            >
              <TouchableOpacity
                style={[
                  tw`flex-1 py-3 rounded-md`,
                  unitSystem === "imperial" ? tw`bg-white` : tw`bg-transparent`,
                ]}
                onPress={() => {
                  if (unitSystem === "metric") {
                    toggleUnitSystem();
                  }
                }}
              >
                <Text
                  style={[
                    tw`text-center font-mont-semibold text-sm`,
                    unitSystem === "imperial"
                      ? tw`text-black`
                      : tw`text-white/70`,
                  ]}
                >
                  Imperial
                </Text>
                <Text
                  style={[
                    tw`text-center font-mont text-xs mt-0.5`,
                    unitSystem === "imperial"
                      ? tw`text-black/70`
                      : tw`text-white/50`,
                  ]}
                >
                  lbs, ft
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`flex-1 py-3 rounded-md`,
                  unitSystem === "metric" ? tw`bg-white` : tw`bg-transparent`,
                ]}
                onPress={() => {
                  if (unitSystem === "imperial") {
                    toggleUnitSystem();
                  }
                }}
              >
                <Text
                  style={[
                    tw`text-center font-mont-semibold text-sm`,
                    unitSystem === "metric"
                      ? tw`text-black`
                      : tw`text-white/70`,
                  ]}
                >
                  Metric
                </Text>
                <Text
                  style={[
                    tw`text-center font-mont text-xs mt-0.5`,
                    unitSystem === "metric"
                      ? tw`text-black/70`
                      : tw`text-white/50`,
                  ]}
                >
                  kg, cm
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <View style={tw`px-4 mb-4`}>
            <Text style={tw`text-white font-tussi text-sm mb-3`}>
              Personal Information
            </Text>

            {/* Age and Gender */}
            <View style={tw`flex-row gap-3 mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                  Age
                </Text>
                <PlatformBlurView
                  intensity={30}
                  tint="dark"
                  style={tw`px-3 py-3 rounded-lg border border-white/10 overflow-hidden`}
                >
                  <TextInput
                    style={tw`text-white font-mont`}
                    placeholder="25"
                    placeholderTextColor="#666"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                  />
                </PlatformBlurView>
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                  Gender
                </Text>
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity
                    style={[
                      tw`flex-1 py-1 rounded-lg border`,
                      gender === "male"
                        ? tw`bg-white border-white`
                        : tw`bg-transparent border-white/30`,
                    ]}
                    onPress={() => setGender("male")}
                  >
                    <Text
                      style={[
                        tw`text-center font-mont-semibold text-sm`,
                        gender === "male" ? tw`text-black` : tw`text-white`,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      tw`flex-1 py-1 rounded-lg border`,
                      gender === "female"
                        ? tw`bg-white border-white`
                        : tw`bg-transparent border-white/30`,
                    ]}
                    onPress={() => setGender("female")}
                  >
                    <Text
                      style={[
                        tw`text-center font-mont-semibold text-sm`,
                        gender === "female" ? tw`text-black` : tw`text-white`,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Height */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                Height {unitSystem === "imperial" ? "(feet / inches)" : "(cm)"}
              </Text>
              {unitSystem === "imperial" ? (
                <View style={tw`flex-row gap-3`}>
                  <PlatformBlurView
                    intensity={30}
                    tint="dark"
                    style={tw`flex-1 px-3 py-3 rounded-lg border border-white/10 overflow-hidden`}
                  >
                    <TextInput
                      style={tw`text-white font-mont`}
                      placeholder="5"
                      placeholderTextColor="#666"
                      value={heightFeet}
                      onChangeText={setHeightFeet}
                      keyboardType="number-pad"
                    />
                  </PlatformBlurView>
                  <PlatformBlurView
                    intensity={30}
                    tint="dark"
                    style={tw`flex-1 px-3 py-3 rounded-lg border border-white/10 overflow-hidden`}
                  >
                    <TextInput
                      style={tw`text-white font-mont`}
                      placeholder="10"
                      placeholderTextColor="#666"
                      value={heightInches}
                      onChangeText={setHeightInches}
                      keyboardType="number-pad"
                    />
                  </PlatformBlurView>
                </View>
              ) : (
                <PlatformBlurView
                  intensity={30}
                  tint="dark"
                  style={tw`px-3 py-3 rounded-lg border border-white/10 overflow-hidden`}
                >
                  <TextInput
                    style={tw`text-white font-mont`}
                    placeholder="175"
                    placeholderTextColor="#666"
                    value={heightCm}
                    onChangeText={setHeightCm}
                    keyboardType="number-pad"
                  />
                </PlatformBlurView>
              )}
            </View>

            {/* Weight */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                Weight ({unitSystem === "imperial" ? "lbs" : "kg"})
              </Text>
              <PlatformBlurView
                intensity={30}
                tint="dark"
                style={tw`px-3 py-3 rounded-lg border border-white/10 overflow-hidden`}
              >
                <TextInput
                  style={tw`text-white font-mont`}
                  placeholder={unitSystem === "imperial" ? "150" : "68"}
                  placeholderTextColor="#666"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
              </PlatformBlurView>
            </View>
          </View>

          {/* Activity Level */}
          <View style={tw`px-4 mb-6`}>
            <Text style={tw`text-white font-tussi text-sm mb-3`}>
              Activity Level
            </Text>

            {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  tw`mb-2 p-3 rounded-lg border`,
                  activityLevel === key
                    ? tw`bg-white border-white`
                    : tw`bg-transparent border-white/20`,
                ]}
                onPress={() => setActivityLevel(key as ActivityLevel)}
              >
                <Text
                  style={[
                    tw`font-mont text-sm`,
                    activityLevel === key ? tw`text-black` : tw`text-white/80`,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Calculate Button at Bottom */}
        <View style={tw`px-4 py-4 bg-black`}>
          <Button
            title="Calculate Calories"
            onPress={handleCalculate}
            loading={isCalculating}
          />
        </View>
      </View>

      {/* Results Modal */}
      <PhoneModal
        visible={showResultsModal}
        onClose={() => setShowResultsModal(false)}
      >
        <PlatformBlurView
          intensity={10}
          opacity={0.9}
          onTouchEnd={() => setShowResultsModal(false)}
          style={tw`flex-1 bg-black/80 justify-center items-center p-4`}
          tint="dark"
        >
          <PlatformBlurView
            onTouchEnd={(e) => e.stopPropagation()}
            intensity={60}
            style={tw`w-full max-h-[85%]`}
            tint="dark"
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setShowResultsModal(false)}
              style={tw`absolute top-1 right-2 z-10 rounded-full p-2`}
            >
              <Text style={tw`text-white font-mont-bold text-lg`}>✕</Text>
            </TouchableOpacity>

            <ScrollView
              style={tw`p-4 border border-white/10 rounded-md`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-2`}
            >
              {results && (
                <>
                  <Text
                    style={tw`text-white font-tussi-bold text-xl mb-4 text-center`}
                  >
                    Your Daily Calorie Needs
                  </Text>

                  {/* BMR and TDEE */}
                  <View style={tw`flex-row gap-3 mb-6`}>
                    <View
                      style={tw`flex-1 bg-white/5 rounded-lg p-3 border border-white/10`}
                    >
                      <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                        BMR
                      </Text>
                      <Text style={tw`text-white font-tussi text-2xl`}>
                        {results.bmr.toLocaleString()}
                      </Text>
                      <Text style={tw`text-white/50 font-mont text-[10px]`}>
                        calories/day
                      </Text>
                    </View>

                    <View
                      style={tw`flex-1 bg-white/5 rounded-lg p-3 border border-white/10`}
                    >
                      <Text style={tw`text-white/70 font-mont text-xs mb-1`}>
                        TDEE
                      </Text>
                      <Text style={tw`text-white font-tussi text-2xl`}>
                        {results.tdee.toLocaleString()}
                      </Text>
                      <Text style={tw`text-white/50 font-mont text-[10px]`}>
                        calories/day
                      </Text>
                    </View>
                  </View>

                  {/* Weight Management Plans */}
                  <Text style={tw`text-white font-tussi text-sm mb-3`}>
                    Weight Management Plans
                  </Text>

                  <View style={tw`gap-3 mb-4`}>
                    {/* Weight Loss */}
                    <View
                      style={tw`bg-white/5 border border-white/10 rounded-lg p-3`}
                    >
                      <View style={tw`flex-row items-center gap-2 mb-2`}>
                        <WeightLossIcon size={20} color="#FF5C2A" />
                        <Text style={tw`text-white font-mont-semibold`}>
                          Weight Loss
                        </Text>
                      </View>
                      <View style={tw`gap-2`}>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Extreme ({unitSystem === "imperial" ? "2 lbs" : "0.9 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.extremeLoss.toLocaleString()}{" "}
                            cal
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Normal ({unitSystem === "imperial" ? "1 lb" : "0.45 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.loss.toLocaleString()} cal
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Mild ({unitSystem === "imperial" ? "0.5 lb" : "0.23 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.mildLoss.toLocaleString()} cal
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Maintenance */}
                    <View
                      style={tw`bg-white/5 border border-white/10 rounded-lg p-3`}
                    >
                      <View style={tw`flex-row justify-between items-center`}>
                        <View style={tw`flex-row items-center gap-2`}>
                          <MaintainIcon size={20} color="#4CAF50" />
                          <Text style={tw`text-white font-mont-semibold`}>
                            Maintain Weight
                          </Text>
                        </View>
                        <Text style={tw`text-white font-mont-medium text-sm`}>
                          {results.weightPlans.maintain.toLocaleString()} cal
                        </Text>
                      </View>
                    </View>

                    {/* Weight Gain */}
                    <View
                      style={tw`bg-white/5 border border-white/10 rounded-lg p-3`}
                    >
                      <View style={tw`flex-row items-center gap-2 mb-2`}>
                        <WeightGainIcon size={20} color="#2196F3" />
                        <Text style={tw`text-white font-mont-semibold`}>
                          Weight Gain
                        </Text>
                      </View>
                      <View style={tw`gap-2`}>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Mild ({unitSystem === "imperial" ? "0.5 lb" : "0.23 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.mildGain.toLocaleString()} cal
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Normal ({unitSystem === "imperial" ? "1 lb" : "0.45 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.gain.toLocaleString()} cal
                          </Text>
                        </View>
                        <View style={tw`flex-row justify-between`}>
                          <Text style={tw`text-white/70 font-mont text-xs`}>
                            Fast ({unitSystem === "imperial" ? "2 lbs" : "0.9 kg"}/week)
                          </Text>
                          <Text style={tw`text-white font-mont-medium text-sm`}>
                            {results.weightPlans.extremeGain.toLocaleString()}{" "}
                            cal
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Button
                    title="Close"
                    onPress={() => setShowResultsModal(false)}
                    style={tw`mt-2`}
                  />
                </>
              )}
            </ScrollView>
          </PlatformBlurView>
        </PlatformBlurView>
      </PhoneModal>
    </SafeAreaBackground>
  );
}
