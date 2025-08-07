import type { LopPersonality } from '@/types';

export const LOP_PERSONALITIES: LopPersonality[] = [
  {
    id: 'bloom',
    name: 'Bloom',
    description: 'Gentle and nurturing, loves nature',
    primaryColor: '#a8e6cf',
    secondaryColor: '#7dd3ae',
    mood: 'happy'
  },
  {
    id: 'dream',
    name: 'Dream',
    description: 'Peaceful and wise, great listener',
    primaryColor: '#c8a8e9',
    secondaryColor: '#a087c7',
    mood: 'thoughtful'
  },
  {
    id: 'sunny',
    name: 'Sunny',
    description: 'Warm and encouraging, spreads joy',
    primaryColor: '#ffc3a0',
    secondaryColor: '#e8a87c',
    mood: 'listening'
  },
  {
    id: 'coral',
    name: 'Coral',
    description: 'Empathetic and caring, always there',
    primaryColor: '#ff8a80',
    secondaryColor: '#e67a70',
    mood: 'happy'
  }
];

export const API_URL = window.location.origin + '/api';