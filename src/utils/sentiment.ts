export type Sentiment = 'positive' | 'negative' | 'neutral';

const POSITIVE_WORDS = [
  'happy', 'good', 'great', 'love', 'excited', 'wonderful', 'amazing',
  'fantastic', 'excellent', 'joy', 'grateful', 'blessed', 'awesome',
  'beautiful', 'perfect', 'proud', 'success', 'win', 'best', 'smile'
];

const NEGATIVE_WORDS = [
  'sad', 'bad', 'tired', 'stressed', 'difficult', 'angry', 'frustrated',
  'disappointed', 'hurt', 'pain', 'worry', 'anxious', 'depressed',
  'lonely', 'scared', 'fail', 'lost', 'hard', 'worst', 'hate'
];

export function analyzeSentiment(text: string): Sentiment {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  for (const word of words) {
    if (POSITIVE_WORDS.some(pw => word.includes(pw))) {
      positiveScore++;
    }
    if (NEGATIVE_WORDS.some(nw => word.includes(nw))) {
      negativeScore++;
    }
  }
  
  if (positiveScore > negativeScore) {
    return 'positive';
  } else if (negativeScore > positiveScore) {
    return 'negative';
  }
  
  return 'neutral';
}

// Generate anonymous encouraging messages based on sentiment matching
export function generateWhisperMessage(senderSentiment: Sentiment): string {
  const messages = {
    positive: [
      "Someone out there is feeling great and wants you to know you're not alone! 🌟",
      "A fellow soul is celebrating life and sending you good vibes!",
      "Someone's joy is overflowing and they want to share it with you!",
      "Another person is having a wonderful day and hopes yours gets better too!"
    ],
    negative: [
      "Someone else is going through a tough time too. You're not alone in this.",
      "Another soul understands your struggle and is sending you strength.",
      "Someone who's also feeling down wants you to know it will get better.",
      "A fellow human facing challenges is thinking of you. We're in this together."
    ],
    neutral: [
      "Someone is thinking of you and hoping you have a peaceful day.",
      "Another person wants you to know you matter.",
      "Someone out there appreciates you just for being you.",
      "A fellow traveler on life's journey sends you calm thoughts."
    ]
  };
  
  const sentimentMessages = messages[senderSentiment];
  return sentimentMessages[Math.floor(Math.random() * sentimentMessages.length)];
}