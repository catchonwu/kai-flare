import { Hono } from 'hono';
import { getSession } from '../utils/auth';

const lop = new Hono<{ Bindings: Env }>();

// Middleware to check authentication
lop.use('*', async (c, next) => {
  const session = await getSession(c.req.raw, c.env);
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  (c as any).userId = session.userId;
  await next();
});

// Lop character responses based on character type
const LOP_RESPONSES = {
  happy_lop: [
    "Yay! Thanks for sharing that with me! 🌈",
    "Your thoughts make my day brighter! ✨",
    "I'm so happy you trust me with your feelings!",
    "Every word you share is like a little gift! 🎁"
  ],
  sleepy_lop: [
    "*yawn* Thanks for the gentle thoughts... 💤",
    "Mmm, your words are like a soft blanket...",
    "I'll dream about what you shared... zzz",
    "So cozy sharing thoughts with you... 😴"
  ],
  curious_lop: [
    "Ooh, tell me more about that! 🤔",
    "That's fascinating! What else is on your mind?",
    "I wonder what made you think of that? 🌟",
    "Your thoughts always spark my curiosity!"
  ],
  zen_lop: [
    "Your thoughts flow like a peaceful stream... 🍃",
    "Thank you for this moment of sharing.",
    "In stillness, we find connection. 🕊️",
    "Your words bring balance to my day."
  ],
  playful_lop: [
    "Wheee! That was fun to hear! 🎪",
    "Your thoughts make me want to do a happy dance!",
    "Let's turn those feelings into an adventure! 🎯",
    "Boop! Thanks for playing with me today!"
  ]
};

lop.get('/response', async (c) => {
  try {
    const userId = (c as any).userId;
    const sentiment = c.req.query('sentiment') || 'neutral';
    
    // Get user's lop character
    const user = await c.env.DB.prepare(
      'SELECT lop_character FROM users WHERE id = ?'
    ).bind(userId).first<{ lop_character: string }>();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const lopCharacter = user.lop_character as keyof typeof LOP_RESPONSES;
    const responses = LOP_RESPONSES[lopCharacter] || LOP_RESPONSES.happy_lop;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Add sentiment-based modifier
    let finalResponse = response;
    if (sentiment === 'negative') {
      finalResponse = `I hear you're going through something tough. ${response} Remember, I'm always here for you. 💙`;
    } else if (sentiment === 'positive') {
      finalResponse = `${response} Your happiness is contagious! 🌟`;
    }

    return c.json({
      message: finalResponse,
      character: lopCharacter,
      sentiment_acknowledged: sentiment
    });
  } catch (error) {
    console.error('Get lop response error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default lop;