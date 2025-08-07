export interface User {
  id: string;
  email: string;
  password_hash: string;
  lop_character: string;
  created_at: number;
}

export interface Thought {
  id: string;
  user_id: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  created_at: number;
}

export interface Whisper {
  id: string;
  to_user_id: string;
  message: string;
  sentiment_match: string;
  created_at: number;
  is_read: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  exp: number;
}

export const LOP_CHARACTERS = [
  'happy_lop',
  'sleepy_lop',
  'curious_lop',
  'zen_lop',
  'playful_lop'
] as const;

export type LopCharacter = typeof LOP_CHARACTERS[number];