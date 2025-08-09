import { LopPersonality } from '../components/LopCharacter';

// Backend LOP_CHARACTERS from src/types/index.ts
export type BackendLopCharacter = 
  | 'happy_lop'
  | 'sleepy_lop'
  | 'curious_lop'
  | 'zen_lop'
  | 'playful_lop';

// Mapping between frontend personalities and backend characters
export const LOP_MAPPING: Record<string, BackendLopCharacter> = {
  'bloom': 'happy_lop',      // Gentle and nurturing -> Happy
  'dream': 'zen_lop',        // Peaceful and wise -> Zen
  'sunny': 'playful_lop',    // Warm and encouraging -> Playful
  'coral': 'curious_lop'     // Empathetic and caring -> Curious
};

// Reverse mapping for converting backend to frontend
export const REVERSE_LOP_MAPPING: Record<BackendLopCharacter, string> = {
  'happy_lop': 'bloom',
  'zen_lop': 'dream',
  'playful_lop': 'sunny',
  'curious_lop': 'coral',
  'sleepy_lop': 'bloom' // Default fallback
};

export function frontendToBackendLop(frontendId: string): BackendLopCharacter {
  return LOP_MAPPING[frontendId] || 'happy_lop';
}

export function backendToFrontendLop(backendCharacter: BackendLopCharacter): string {
  return REVERSE_LOP_MAPPING[backendCharacter] || 'bloom';
}

export function getLopPersonalityById(id: string): LopPersonality | undefined {
  // Import here to avoid circular dependency
  const { lopPersonalities } = require('../components/LopCharacter');
  return lopPersonalities.find((lop: LopPersonality) => lop.id === id);
}