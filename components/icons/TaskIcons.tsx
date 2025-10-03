import React from "react";
import { Svg, Path, Circle, G } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

// RECOVERY ICONS
export const SleepIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M15.5 12C15.5 8.96 13.04 6.5 10 6.5C6.96 6.5 4.5 8.96 4.5 12C4.5 15.04 6.96 17.5 10 17.5C13.04 17.5 15.5 15.04 15.5 12Z"
      fill={color}
    />
  </Svg>
);

export const WakeUpIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" fill={color} />
    <Path d="M12 2V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 20V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4.22 4.22L5.64 5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18.36 18.36L19.78 19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M2 12H4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M20 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4.22 19.78L5.64 18.36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const WindDownIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z"
      fill={color}
    />
  </Svg>
);

export const SunlightIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" fill={color} />
    <Path d="M12 1V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 21V23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4.22 4.22L5.64 5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18.36 18.36L19.78 19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M1 12H3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 12H23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4.22 19.78L5.64 18.36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ColdShowerIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 2V4H6V6H8V8H10V6H12V4H10V2H8Z"
      fill={color}
    />
    <Path
      d="M16 4V2H14V4H12V6H14V8H16V6H18V4H16Z"
      fill={color}
    />
    <Path
      d="M20 8V10H18V12H20V14H22V12H24V10H22V8H20Z"
      fill={color}
    />
    <Path
      d="M4 10V8H2V10H0V12H2V14H4V12H6V10H4Z"
      fill={color}
    />
    <Path
      d="M7 16L5 22H19L17 16H7Z"
      fill={color}
      opacity="0.6"
    />
    <Path
      d="M9 18H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 20H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const WaterIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L8 8C6.9 9.5 6.9 11.5 8 13C9.1 14.5 11.9 14.5 13 13L17 7L12 2Z"
      fill={color}
    />
    <Path
      d="M12 22C16 22 19 19 19 15C19 11 16 8 12 8C8 8 5 11 5 15C5 19 8 22 12 22Z"
      fill={color}
      opacity="0.6"
    />
  </Svg>
);

// MOVEMENT ICONS
export const WorkoutIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z"
      fill={color}
    />
  </Svg>
);

export const StrengthTrainingIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12H6V8H10V12H14V8H18V12H22V14H18V16H14V12H10V16H6V12H2V14H2V12Z"
      fill={color}
    />
    <Circle cx="4" cy="13" r="2" fill={color} />
    <Circle cx="20" cy="13" r="2" fill={color} />
  </Svg>
);

export const RunningIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="4" r="2" fill={color} />
    <Path
      d="M21 22H19L13.5 16.5L11.5 18.5L8.5 15.5L7 17H4V15H6L8.5 12.5L11.5 15.5L15.5 11.5L21 22Z"
      fill={color}
    />
    <Path
      d="M13 8L8.5 13.5L10.5 15.5L15 10L13 8Z"
      fill={color}
      opacity="0.6"
    />
  </Svg>
);

export const CyclingIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="18" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="6" cy="18" r="4" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M8 16L12 12L16 16"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 12V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="6" r="2" fill={color} />
  </Svg>
);

export const WalkingIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="4" r="2" fill={color} />
    <Path
      d="M15.5 22H13.5L11 16L10 18V22H8V16L10 12L8 8H10L12 12L14 8H16L14 14L15.5 22Z"
      fill={color}
    />
  </Svg>
);

export const PushupsIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4Z"
      fill={color}
    />
    <Path
      d="M4 12L8 8L10 10L8 12H16L14 10L16 8L20 12H18V20H6V12H4Z"
      fill={color}
    />
  </Svg>
);

export const PullupsIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 2H22V4H2V2Z"
      fill={color}
    />
    <Circle cx="12" cy="8" r="2" fill={color} />
    <Path
      d="M8 4V6H10V16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16V6H16V4H8Z"
      fill={color}
    />
    <Path
      d="M6 18L8 20L10 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 18L16 20L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// FUEL ICONS
export const EatCleanIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13.09 8.26L22 8L14 12L22 16L13.09 15.74L12 22L10.91 15.74L2 16L10 12L2 8L10.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const NoSugarIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path
      d="M8 6H16C17.1 6 18 6.9 18 8V16C18 17.1 17.1 18 16 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z"
      fill={color}
      opacity="0.3"
    />
  </Svg>
);

export const NoProcessedFoodIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path
      d="M8 8H16V10H14V12H16V14H14V16H8V8Z"
      fill={color}
      opacity="0.3"
    />
  </Svg>
);

export const NoSeedOilsIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path
      d="M8 10L10 8L14 12L12 14L8 10Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M14 14L16 16H18V18L16 16L14 14Z"
      fill={color}
      opacity="0.3"
    />
  </Svg>
);

export const NoGlutenIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path
      d="M8 8C8 6.9 8.9 6 10 6H14C15.1 6 16 6.9 16 8V16C16 17.1 15.1 18 14 18H10C8.9 18 8 17.1 8 16V8Z"
      fill={color}
      opacity="0.3"
    />
  </Svg>
);

export const NoLactoseIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path
      d="M8 8V16C8 17.1 8.9 18 10 18H14C15.1 18 16 17.1 16 16V8C16 6.9 15.1 6 14 6H10C8.9 6 8 6.9 8 8Z"
      fill={color}
      opacity="0.3"
    />
  </Svg>
);

export const ProteinIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M8 8H12V10H10V12H12V14H10V16H8V8Z"
      fill={color}
    />
    <Path
      d="M14 8H16V16H14V8Z"
      fill={color}
    />
  </Svg>
);

export const VegetablesIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C13.1 2 14 2.9 14 4V6C17.31 6 20 8.69 20 12V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V12C4 8.69 6.69 6 10 6V4C10 2.9 10.9 2 12 2Z"
      fill={color}
    />
    <Circle cx="8" cy="14" r="1" fill="white" />
    <Circle cx="12" cy="16" r="1" fill="white" />
    <Circle cx="16" cy="14" r="1" fill="white" />
  </Svg>
);

export const CaloriesIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="3" fill="white" />
  </Svg>
);

export const SupplementsIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2Z"
      fill={color}
      opacity="0.3"
    />
    <Circle cx="8" cy="8" r="2" fill={color} />
    <Circle cx="16" cy="8" r="2" fill={color} />
    <Circle cx="12" cy="14" r="2" fill={color} />
    <Circle cx="8" cy="18" r="1" fill={color} />
    <Circle cx="16" cy="18" r="1" fill={color} />
  </Svg>
);

// GROWTH ICONS
export const DeepWorkIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20V20H4V4Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M8 8H16V10H8V8Z"
      fill={color}
    />
    <Path
      d="M8 12H16V14H8V12Z"
      fill={color}
    />
    <Path
      d="M8 16H12V18H8V16Z"
      fill={color}
    />
  </Svg>
);

export const SocialMediaLimitIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 2H20C21.1 2 22 2.9 22 4V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2Z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M4.93 4.93L19.07 19.07" stroke={color} strokeWidth="2" />
    <Path d="M8 22H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const MeditationIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="3" fill={color} />
    <Path
      d="M12 14C8 14 8 18 8 18V20H16V18C16 18 16 14 12 14Z"
      fill={color}
    />
    <Path
      d="M8 18C6 16 4 14 4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M16 18C18 16 20 14 20 12C20 10.9 19.1 10 18 10C16.9 10 16 10.9 16 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export const ReadingIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 2H20C21.1 2 22 2.9 22 4V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V4C2 2.9 2.9 2 4 2Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M6 6H18V8H6V6Z"
      fill={color}
    />
    <Path
      d="M6 10H18V12H6V10Z"
      fill={color}
    />
    <Path
      d="M6 14H14V16H6V14Z"
      fill={color}
    />
  </Svg>
);

export const SideHustleIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
      opacity="0.3"
    />
    <Path
      d="M12 6L13.5 10.5L18 11L15 14L15.75 18.5L12 16.5L8.25 18.5L9 14L6 11L10.5 10.5L12 6Z"
      fill={color}
    />
  </Svg>
);

export const BusinessIdeaIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L13 8L19 9L14 14L15 20L12 18L9 20L10 14L5 9L11 8L12 2Z"
      fill={color}
    />
    <Circle cx="12" cy="12" r="2" fill="white" />
  </Svg>
);

export const EpicGoalIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
      fill={color}
    />
  </Svg>
);

export const LearnSkillIcon = ({ size = 24, color = "currentColor" }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L22 7L12 12L2 7L12 2Z"
      fill={color}
    />
    <Path
      d="M2 17L12 22L22 17"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2 12L12 17L22 12"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Task name to icon mapping
export const taskIcons: Record<string, React.ComponentType<IconProps>> = {
  // Recovery
  "Sleep for 8 hours": SleepIcon,
  "Consistent wake time": WakeUpIcon,
  "Complete wind-down routine": WindDownIcon,
  "Get morning sunlight": SunlightIcon,
  "Cold shower": ColdShowerIcon,
  "Drink 2.5 L water": WaterIcon,

  // Movement
  "Workout": WorkoutIcon,
  "Strength Training": StrengthTrainingIcon,
  "Running": RunningIcon,
  "Cycling": CyclingIcon,
  "Walking steps target": WalkingIcon,
  "Pushups": PushupsIcon,
  "Pullups": PullupsIcon,

  // Fuel
  "Eat clean": EatCleanIcon,
  "No sugar": NoSugarIcon,
  "No processed fooda": NoProcessedFoodIcon, // Note: keeping the typo as in backend
  "No seed oils": NoSeedOilsIcon,
  "No gluten": NoGlutenIcon,
  "No lactose": NoLactoseIcon,
  "Hit protein target": ProteinIcon,
  "Eat vegetables": VegetablesIcon,
  "Calorie target": CaloriesIcon,
  "Take supplements": SupplementsIcon,

  // Growth
  "Deep work": DeepWorkIcon,
  "Limit social media": SocialMediaLimitIcon,
  "Meditation": MeditationIcon,
  "Reading": ReadingIcon,
  "Work on side hustle": SideHustleIcon,
  "Work on business idea": BusinessIdeaIcon,
  "Epic goal": EpicGoalIcon,
  "Learn a skill": LearnSkillIcon,
};

// Helper function to get icon component by task name
export const getTaskIcon = (taskName: string): React.ComponentType<IconProps> | null => {
  return taskIcons[taskName] || null;
};