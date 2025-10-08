interface CountdownMessage {
  title: string;
  body: string;
}

export const countdownMessages: { [daysLeft: number]: CountdownMessage } = {
  7: {
    title: "7 Days Until Winter Arc",
    body: "One week to go. Start preparing your mind and body.",
  },
  6: {
    title: "6 Days to Launch",
    body: "The countdown begins. Are you ready to transform?",
  },
  5: {
    title: "5 Days Remaining",
    body: "Lock in your goals. The journey starts soon.",
  },
  4: {
    title: "4 Days to Go",
    body: "Visualize the person you'll become in 90 days.",
  },
  3: {
    title: "3 Days Until Winter Arc",
    body: "Final preparations. Commit to the process.",
  },
  2: {
    title: "2 Days Left",
    body: "Almost time. Get your mind right.",
  },
  1: {
    title: "Tomorrow We Begin",
    body: "Your Winter Arc starts tomorrow. Rest up, tomorrow we grind.",
  },
  0: {
    title: "Winter Arc Starts Today",
    body: "This is it. Day 1. Let's go.",
  },
};

export const defaultCountdownMessage: CountdownMessage = {
  title: "Winter Arc Approaching",
  body: "Your transformation begins soon. Stay ready.",
};
