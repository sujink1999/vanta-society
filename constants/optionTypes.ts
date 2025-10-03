// Task option types
export const OPTION_TYPES = {
  WORKOUT_DURATION: "workout_duration",
  WORK_DURATION: "work_duration",
  MAX_IDLE_DURATION: "max_idle_duration",
  MINDFULNESS_DURATION: "mindfulness_duration",

  PAGE_COUNT: "page_count",
  STEP_COUNT: "step_count",
  REP_COUNT: "rep_count",
  MACRO_QUANTITY: "macro_quantity",
  FOOD_QUANTITY: "food_quantity",
  CALORIE_QUANTITY: "calorie_quantity",
  TIME_OF_DAY: "time_of_day",
  TEXT: "text",
} as const;

export type OptionType = (typeof OPTION_TYPES)[keyof typeof OPTION_TYPES];

// Display names for each option type
export const OPTION_NAMES: Record<string, string> = {
  [OPTION_TYPES.WORKOUT_DURATION]: "Duration",
  [OPTION_TYPES.WORK_DURATION]: "Duration",
  [OPTION_TYPES.MAX_IDLE_DURATION]: "Time Limit",
  [OPTION_TYPES.MINDFULNESS_DURATION]: "Duration",
  [OPTION_TYPES.PAGE_COUNT]: "Pages",
  [OPTION_TYPES.STEP_COUNT]: "Steps",
  [OPTION_TYPES.REP_COUNT]: "Reps",
  [OPTION_TYPES.MACRO_QUANTITY]: "Amount",
  [OPTION_TYPES.FOOD_QUANTITY]: "Quantity",
  [OPTION_TYPES.CALORIE_QUANTITY]: "Calories",
  [OPTION_TYPES.TIME_OF_DAY]: "Time",
};

// Option values for each type
export const OPTION_VALUES: Record<string, string[]> = {
  [OPTION_TYPES.WORKOUT_DURATION]: [
    "15 minutes",
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "90 minutes",
  ],
  [OPTION_TYPES.WORK_DURATION]: [
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "90 minutes",
    "120 minutes",
  ],
  [OPTION_TYPES.MAX_IDLE_DURATION]: [
    "15 minutes",
    "30 minutes",
    "45 minutes",
    "60 minutes",
  ],
  [OPTION_TYPES.MINDFULNESS_DURATION]: [
    "5 minutes",
    "10 minutes",
    "15 minutes",
    "20 minutes",
    "30 minutes",
    "45 minutes",
    "60 minutes",
    "90 minutes",
    "120 minutes",
  ],
  [OPTION_TYPES.PAGE_COUNT]: [
    "5 pages",
    "10 pages",
    "15 pages",
    "20 pages",
    "25 pages",
  ],
  [OPTION_TYPES.STEP_COUNT]: [
    "5,000 steps",
    "8,000 steps",
    "10,000 steps",
    "12,000 steps",
    "15,000 steps",
  ],
  [OPTION_TYPES.REP_COUNT]: [
    "10 reps",
    "20 reps",
    "30 reps",
    "50 reps",
    "75 reps",
    "100 reps",
  ],
  [OPTION_TYPES.MACRO_QUANTITY]: ["50 g", "75 g", "100 g", "125 g", "150 g"],
  [OPTION_TYPES.FOOD_QUANTITY]: ["100 g", "200 g", "300 g", "400 g", "500 g"],
  [OPTION_TYPES.CALORIE_QUANTITY]: [
    "1,500 kcal",
    "1,800 kcal",
    "2,000 kcal",
    "2,200 kcal",
    "2,500 kcal",
  ],
};
