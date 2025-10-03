// Helper function to convert cadence array to frequency text
export const cadenceToFrequency = (cadence: number[]): string => {
  const totalDays = cadence.reduce((sum, day) => sum + day, 0);

  if (totalDays === 7) {
    return "Daily";
  } else if (
    totalDays === 5 &&
    cadence[0] === 1 &&
    cadence[1] === 1 &&
    cadence[2] === 1 &&
    cadence[3] === 1 &&
    cadence[4] === 1
  ) {
    return "Weekdays";
  } else {
    return `${totalDays}x weekly`;
  }
};

// Helper function to construct task command from taskText and optionsSet
export const constructTaskCommand = (
  taskText: string,
  taskName: string,
  optionsSet: any[]
): string => {
  if (!optionsSet || optionsSet.length === 0) {
    return taskName;
  }

  let command = taskText;
  const values = optionsSet.map((option) => option.value).filter(Boolean);

  if (values.length > 0) {
    const formattedValues = optionsSet
      .map((option) => {
        let preposition = "";
        const formattedOptionType = option?.type?.toLowerCase();

        if (formattedOptionType?.includes("duration")) {
          preposition = "for";
        } else if (formattedOptionType === "time_of_day") {
          preposition = "at";
        } else if (formattedOptionType === "text") {
          preposition = "-";
        }

        if (preposition && option.value) {
          return `${preposition} ${option.value}`;
        } else if (option.value) {
          return option.value;
        }
        return "";
      })
      .filter(Boolean);

    command = `${taskText} ${formattedValues.join(" ")}`;
  }

  return command;
};