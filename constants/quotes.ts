export interface Quote {
  text: string;
  author: string;
}

export const MORNING_QUOTES: Quote[] = [
  {
    text: "You don't get what you wish for, you get what you work for.",
    author: "Alex Hormozi",
  },
  {
    text: "The only way to win is to learn faster than anyone else.",
    author: "Alex Hormozi",
  },
  {
    text: "The more you do, the more you can do.",
    author: "Alex Hormozi",
  },
  {
    text: "You can't outwork a bad strategy, but a good strategy with hard work is unstoppable.",
    author: "Alex Hormozi",
  },
  {
    text: "The work is the thing. The work is what changes you.",
    author: "Chris Williamson",
  },
  {
    text: "Discipline is just choosing between what you want now and what you want most.",
    author: "Chris Williamson",
  },
  {
    text: "You can't hate yourself into a version of yourself you love.",
    author: "Chris Williamson",
  },
  {
    text: "Your standards are a reflection of your self-respect.",
    author: "Chris Williamson",
  },
  {
    text: "The market doesn't care about your emotions. It rewards those who show up consistently.",
    author: "Nikhil Kamath",
  },
  {
    text: "Success is about learning from failures, not avoiding them.",
    author: "Nikhil Kamath",
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "David Goggins",
  },
  {
    text: "You are in danger of living a life so comfortable that you die without ever realizing your potential.",
    author: "David Goggins",
  },
  {
    text: "Suffering is a test. That's all it is. Suffering is the true test of life.",
    author: "David Goggins",
  },
  {
    text: "The most important conversation is the one you have with yourself.",
    author: "David Goggins",
  },
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
  },
  {
    text: "Don't expect to be motivated every day to get out there and make things happen.",
    author: "Jocko Willink",
  },
  {
    text: "The pathway to mastery is through discomfort.",
    author: "Andrew Huberman",
  },
  {
    text: "Your nervous system doesn't distinguish between different types of stress. Recovery is key.",
    author: "Andrew Huberman",
  },
  {
    text: "If you want to improve, be content to be thought foolish and stupid.",
    author: "Naval Ravikant",
  },
  {
    text: "Play long-term games with long-term people.",
    author: "Naval Ravikant",
  },
  {
    text: "Specific knowledge is knowledge you cannot be trained for.",
    author: "Naval Ravikant",
  },
  {
    text: "The real test is not whether you avoid failure, but whether you let it harden or shame you.",
    author: "Jordan Peterson",
  },
  {
    text: "You should take the approach that you're wrong. Your goal is to be less wrong.",
    author: "Elon Musk",
  },
  {
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
  },
  {
    text: "Focus is a matter of deciding what things you're not going to do.",
    author: "Tim Ferriss",
  },
  {
    text: "Being busy is a form of laziness - lazy thinking and indiscriminate action.",
    author: "Tim Ferriss",
  },
  {
    text: "Macro patience, micro speed.",
    author: "Gary Vaynerchuk",
  },
  {
    text: "Your legacy is being written by yourself. Make the right decisions.",
    author: "Gary Vaynerchuk",
  },
  {
    text: "Humans are very good at taking a small number of experiences and extrapolating.",
    author: "Lex Fridman",
  },
  {
    text: "The mind is the athlete, the body is simply the medium.",
    author: "Rich Roll",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "I hated every minute of training, but I said, don't quit. Suffer now and live the rest of your life as a champion.",
    author: "Muhammad Ali",
  },
  {
    text: "Hard choices, easy life. Easy choices, hard life.",
    author: "Jerzy Gregorek",
  },
  {
    text: "You have to be burning with an idea, or a problem, or a wrong that you want to right.",
    author: "Steve Jobs",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "If you're not embarrassed by the first version, you've launched too late.",
    author: "Reid Hoffman",
  },
  {
    text: "Losers have goals. Winners have systems.",
    author: "Scott Adams",
  },
  {
    text: "Competition is for losers. Create something new.",
    author: "Peter Thiel",
  },
  {
    text: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg",
  },
  {
    text: "Failure is not permanent, but giving up is.",
    author: "Ankur Warikoo",
  },
  {
    text: "Your current situation is not your final destination.",
    author: "Ankur Warikoo",
  },
  {
    text: "Consistency will always beat intensity.",
    author: "Ranveer Allahbadia",
  },
  {
    text: "The quality of your life is determined by the quality of the questions you ask yourself.",
    author: "Tony Robbins",
  },
  {
    text: "Every master was once a disaster.",
    author: "T. Harv Eker",
  },
  {
    text: "It's not about having time. It's about making time.",
    author: "James Clear",
  },
  {
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
  },
  {
    text: "The cost of not following your heart, is spending the rest of your life wishing you had.",
    author: "J. Paulsen",
  },
  {
    text: "Ordinary people think merely of spending time. Great people think of using it.",
    author: "Arthur Schopenhauer",
  },
  {
    text: "Success is the progressive realization of a worthy goal or ideal.",
    author: "Earl Nightingale",
  },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius",
  },
];

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * MORNING_QUOTES.length);
  return MORNING_QUOTES[randomIndex];
}
