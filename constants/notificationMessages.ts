export type EngagementState =
  | "engaged"
  | "inactive_today"
  | "missing_1_day"
  | "missing_2+_days"
  | "on_streak";

export type TimeSlot = "morning" | "midday" | "evening" | "night";

interface NotificationMessage {
  title: string;
  body: string;
}

type MessagesConfig = {
  [key in TimeSlot]: {
    [state in EngagementState]: NotificationMessage[];
  };
};

export const notificationMessages: MessagesConfig = {
  morning: {
    engaged: [
      {
        title: "Morning, Champion",
        body: "Yesterday's momentum is still alive. Let's keep building.",
      },
      {
        title: "Another Day to Win",
        body: "You showed up yesterday. Do it again today.",
      },
      {
        title: "The Grind Continues",
        body: "Consistency is what separates you from the rest.",
      },
      {
        title: "Build on Yesterday",
        body: "You're not starting from zero. You're building on yesterday's progress.",
      },
      {
        title: "Morning Ritual",
        body: "Winners have routines. Start yours now.",
      },
    ],
    inactive_today: [
      {
        title: "Time to Start",
        body: "The day's already moving. Don't let it pass you by.",
      },
      {
        title: "Your Move",
        body: "Yesterday you showed up. Today needs the same energy.",
      },
      {
        title: "Fresh Start",
        body: "Every morning is a reset. Use it.",
      },
      {
        title: "The Clock's Ticking",
        body: "You know what needs to be done. Start now.",
      },
      {
        title: "Show Up Today",
        body: "Consistency is the only thing that matters.",
      },
    ],
    missing_1_day: [
      {
        title: "Don't Skip Two",
        body: "Missing one day isn't the problem. Missing two is how it starts.",
      },
      {
        title: "Get Back in the Game",
        body: "Yesterday's gone. Today is your chance to recover.",
      },
      {
        title: "Break the Pattern",
        body: "One day off can become two. Show up today.",
      },
      {
        title: "Recovery Mode",
        body: "Champions stumble. But they never stay down.",
      },
      {
        title: "This is the Test",
        body: "How you respond to a miss defines you.",
      },
    ],
    "missing_2+_days": [
      {
        title: "It's Not Over",
        body: "Missing days happen. Giving up is the only real failure.",
      },
      {
        title: "Today Changes Everything",
        body: "You're not too far gone. Start right now.",
      },
      {
        title: "The Comeback Starts Now",
        body: "Every champion has a comeback story. This is yours.",
      },
      {
        title: "One Task",
        body: "Don't overthink it. Just do one thing today.",
      },
      {
        title: "Fresh Start",
        body: "The past doesn't define you. Today does.",
      },
    ],
    on_streak: [
      {
        title: "Protect the Streak",
        body: "You've built something real. Don't let it die today.",
      },
      {
        title: "Momentum is Power",
        body: "Every day you show up makes tomorrow easier.",
      },
      {
        title: "Keep Going",
        body: "Your streak is proof you're different. Keep proving it.",
      },
      {
        title: "This is Who You Are",
        body: "Consistency isn't a phase. It's your identity now.",
      },
      {
        title: "Don't Break the Chain",
        body: "You've come too far to stop now.",
      },
    ],
  },

  midday: {
    engaged: [
      {
        title: "Keep the Momentum",
        body: "You started strong. Finish stronger.",
      },
      {
        title: "Half the Day Done",
        body: "Use the second half to stack more wins.",
      },
      {
        title: "You're On Track",
        body: "Don't slow down now. Push through.",
      },
      {
        title: "Midday Check",
        body: "Progress is progress. Keep moving forward.",
      },
      {
        title: "Stay Locked In",
        body: "The day isn't over. Keep the energy high.",
      },
    ],
    inactive_today: [
      {
        title: "Half the Day is Gone",
        body: "You still have time. Don't waste it.",
      },
      {
        title: "Time to Move",
        body: "Sitting on the sidelines won't get you anywhere.",
      },
      {
        title: "Show Up Now",
        body: "Your future self will thank you for starting today.",
      },
      {
        title: "No More Excuses",
        body: "You know what needs to be done. Do it.",
      },
      {
        title: "Make This Afternoon Count",
        body: "Don't let today be a zero.",
      },
    ],
    missing_1_day: [
      {
        title: "Recover Today",
        body: "Yesterday's miss doesn't matter if you show up now.",
      },
      {
        title: "The Afternoon is Yours",
        body: "Use it to get back on track.",
      },
      {
        title: "Don't Waste Another Day",
        body: "You still have hours left. Make them count.",
      },
      {
        title: "This is Your Moment",
        body: "Prove that one miss doesn't define you.",
      },
      {
        title: "Start Now",
        body: "Half a day of work beats zero days of nothing.",
      },
    ],
    "missing_2+_days": [
      {
        title: "Today is the Day",
        body: "Stop waiting for the perfect moment. This is it.",
      },
      {
        title: "One Task Changes Everything",
        body: "Just start. Momentum builds from action.",
      },
      {
        title: "Don't Wait Until Tomorrow",
        body: "Tomorrow never comes. Start right now.",
      },
      {
        title: "Break the Cycle",
        body: "Do one thing today. That's all it takes.",
      },
      {
        title: "You're Better Than This",
        body: "Show yourself what you're capable of. Start now.",
      },
    ],
    on_streak: [
      {
        title: "Protect What You Built",
        body: "Your streak is alive because of days like this.",
      },
      {
        title: "Stay Sharp",
        body: "Consistency is the only currency that matters.",
      },
      {
        title: "Don't Get Comfortable",
        body: "Streaks die when you think they're safe.",
      },
      {
        title: "This is What Separates You",
        body: "Most people quit. You keep going.",
      },
      {
        title: "Keep Stacking",
        body: "Every day you show up is a brick in your foundation.",
      },
    ],
  },

  evening: {
    engaged: [
      {
        title: "Strong Finish",
        body: "You've done well today. Close it out properly.",
      },
      {
        title: "One More Push",
        body: "Don't leave anything on the table. Finish today right.",
      },
      {
        title: "Seal the Day",
        body: "Champions finish strong. That's you.",
      },
      {
        title: "Evening Grind",
        body: "The day's almost over. Make these hours count.",
      },
      {
        title: "Cap It Off",
        body: "You've built momentum. Lock it in.",
      },
    ],
    inactive_today: [
      {
        title: "Last Chance",
        body: "Don't let today be a zero. You still have time.",
      },
      {
        title: "Evening Opportunity",
        body: "The day isn't over until you say it is. Move now.",
      },
      {
        title: "Save the Day",
        body: "Do one task right now. That's all it takes.",
      },
      {
        title: "Don't Sleep on Zero",
        body: "You'll regret this tomorrow. Act now.",
      },
      {
        title: "This is Your Window",
        body: "Use these hours. Tomorrow you'll be proud you did.",
      },
    ],
    missing_1_day: [
      {
        title: "Don't Make It Two",
        body: "One day off is recoverable. Two starts a pattern.",
      },
      {
        title: "Evening Recovery",
        body: "You can still save today. Do something. Anything.",
      },
      {
        title: "Break the Slide",
        body: "This is where winners separate from quitters.",
      },
      {
        title: "Last Call",
        body: "Do one task before bed. Just one.",
      },
      {
        title: "Make Tonight Count",
        body: "Tomorrow you'll either regret tonight or thank yourself for it.",
      },
    ],
    "missing_2+_days": [
      {
        title: "Stop the Bleed",
        body: "Every day that passes makes it harder to return. Start tonight.",
      },
      {
        title: "Tonight Decides Everything",
        body: "Do you want to keep falling or start climbing?",
      },
      {
        title: "One Task",
        body: "That's all you need. One task to prove you're back.",
      },
      {
        title: "The Comeback is Now",
        body: "Champions don't wait. They act. Right now.",
      },
      {
        title: "Don't Let This Day Pass",
        body: "You'll hate yourself tomorrow if you do nothing tonight.",
      },
    ],
    on_streak: [
      {
        title: "Don't Break It Now",
        body: "You've come too far. Finish today strong.",
      },
      {
        title: "Protect Your Streak",
        body: "This is what you've built. Don't let it end here.",
      },
      {
        title: "Close the Day Right",
        body: "Streaks aren't accidents. They're built on days like this.",
      },
      {
        title: "One More Day",
        body: "That's all you need. Stack another win.",
      },
      {
        title: "This is Your Legacy",
        body: "Every day you protect this streak builds who you are.",
      },
    ],
  },

  night: {
    engaged: [
      {
        title: "Well Done Today",
        body: "You showed up. That's what winners do.",
      },
      {
        title: "You Earned This",
        body: "Rest knowing you gave today what it deserved.",
      },
      {
        title: "Another Day Won",
        body: "Tomorrow's you will thank today's you.",
      },
      {
        title: "Consistent Excellence",
        body: "This is how champions are built. One day at a time.",
      },
      {
        title: "Good Night, Champion",
        body: "You did the work. Sleep well.",
      },
    ],
    inactive_today: [
      {
        title: "What Happened Today?",
        body: "Tomorrow's a fresh start, but tonight you need to think about why.",
      },
      {
        title: "Tomorrow's Another Chance",
        body: "Learn from today. Don't repeat it tomorrow.",
      },
      {
        title: "Reflect Tonight",
        body: "What stopped you today? Fix it tomorrow.",
      },
      {
        title: "Reset for Tomorrow",
        body: "Today's done. Tomorrow you have to show up.",
      },
      {
        title: "Don't Make This a Pattern",
        body: "One day off is fine. Two is a problem.",
      },
    ],
    missing_1_day: [
      {
        title: "Two Days Missed",
        body: "This is where it gets dangerous. Tomorrow changes everything.",
      },
      {
        title: "Wake Up Tomorrow Ready",
        body: "You can't afford another miss. Plan your comeback tonight.",
      },
      {
        title: "Tomorrow is Critical",
        body: "Two days off can become three. Don't let it happen.",
      },
      {
        title: "This is the Test",
        body: "How you respond tomorrow defines who you are.",
      },
      {
        title: "Get Right Tonight",
        body: "Plan tomorrow now. Don't wing it.",
      },
    ],
    "missing_2+_days": [
      {
        title: "This is Rock Bottom",
        body: "Tomorrow you either start climbing or keep falling. Your choice.",
      },
      {
        title: "Tomorrow Decides Everything",
        body: "Are you done or are you coming back? Tomorrow tells the truth.",
      },
      {
        title: "Wake Up Different",
        body: "Tomorrow needs to be the day. No more excuses.",
      },
      {
        title: "The Comeback Starts Tomorrow",
        body: "But you have to decide tonight. Are you in or out?",
      },
      {
        title: "Last Chance Mindset",
        body: "Tomorrow morning, you're either all in or you're done.",
      },
    ],
    on_streak: [
      {
        title: "Streak Protected",
        body: "Another day stacked. This is who you are.",
      },
      {
        title: "Consistency is Your Superpower",
        body: "Most people can't do this. You can.",
      },
      {
        title: "This is Discipline",
        body: "Every day you protect this streak proves you're built different.",
      },
      {
        title: "Keep Building",
        body: "Your streak is a monument to your willpower. Don't stop now.",
      },
      {
        title: "Tomorrow We Go Again",
        body: "Rest tonight. Tomorrow we add another day.",
      },
    ],
  },
};
