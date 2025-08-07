export interface LopPersonality {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  mood: 'happy' | 'thoughtful' | 'listening' | 'sleepy';
}

export interface User {
  id: string;
  email: string;
  selectedLop?: LopPersonality;
}

export interface Memory {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  tags: string[];
  isHighlight: boolean;
}

export interface Whisper {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  reactions: number;
  hasReacted: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}