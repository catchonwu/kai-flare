import React from 'react';

export interface LopPersonality {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  mood: 'happy' | 'thoughtful' | 'listening' | 'sleepy';
}

export const lopPersonalities: LopPersonality[] = [
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

interface LopCharacterProps {
  personality: LopPersonality;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function LopCharacter({ 
  personality, 
  size = 'md', 
  animated = false,
  className = '',
  onClick
}: LopCharacterProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const earSize = {
    sm: { width: 8, height: 16 },
    md: { width: 12, height: 24 },
    lg: { width: 16, height: 32 },
    xl: { width: 20, height: 40 }
  };

  const bodySize = {
    sm: { width: 40, height: 32 },
    md: { width: 60, height: 48 },
    lg: { width: 80, height: 64 },
    xl: { width: 120, height: 96 }
  };

  const eyeSize = {
    sm: 3,
    md: 4,
    lg: 6,
    xl: 8
  };

  const getEyeExpression = (mood: string) => {
    switch (mood) {
      case 'happy':
        return { shape: 'circle', offsetY: 0 };
      case 'thoughtful':
        return { shape: 'ellipse', offsetY: 2 };
      case 'listening':
        return { shape: 'circle', offsetY: -1 };
      case 'sleepy':
        return { shape: 'ellipse', offsetY: 4 };
      default:
        return { shape: 'circle', offsetY: 0 };
    }
  };

  const eyeExpression = getEyeExpression(personality.mood);

  return (
    <div 
      className={`${sizeClasses[size]} ${className} flex items-center justify-center relative ${onClick ? 'cursor-pointer' : ''} p-1`}
      onClick={onClick}
    >
      <svg
        viewBox="-20 -20 140 140"
        className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
      >
        {/* Left Ear */}
        <ellipse
          cx="35"
          cy="42"
          rx={earSize[size].width}
          ry={earSize[size].height}
          fill={personality.primaryColor}
          transform="rotate(-10 35 42)"
          opacity="0.9"
        />
        <ellipse
          cx="35"
          cy="42"
          rx={earSize[size].width * 0.6}
          ry={earSize[size].height * 0.7}
          fill={personality.secondaryColor}
          transform="rotate(-10 35 42)"
          opacity="0.7"
        />

        {/* Right Ear */}
        <ellipse
          cx="65"
          cy="42"
          rx={earSize[size].width}
          ry={earSize[size].height}
          fill={personality.primaryColor}
          transform="rotate(10 65 42)"
          opacity="0.9"
        />
        <ellipse
          cx="65"
          cy="42"
          rx={earSize[size].width * 0.6}
          ry={earSize[size].height * 0.7}
          fill={personality.secondaryColor}
          transform="rotate(10 65 42)"
          opacity="0.7"
        />

        {/* Body */}
        <ellipse
          cx="50"
          cy="55"
          rx={bodySize[size].width / 2}
          ry={bodySize[size].height / 2}
          fill={personality.primaryColor}
          opacity="0.95"
        />
        
        {/* Body highlight */}
        <ellipse
          cx="50"
          cy="50"
          rx={bodySize[size].width / 3}
          ry={bodySize[size].height / 3}
          fill="white"
          opacity="0.3"
        />

        {/* Left Eye */}
        {eyeExpression.shape === 'circle' ? (
          <circle
            cx="42"
            cy={45 + eyeExpression.offsetY}
            r={eyeSize[size]}
            fill="#2a2a32"
            opacity="0.8"
          />
        ) : (
          <ellipse
            cx="42"
            cy={45 + eyeExpression.offsetY}
            rx={eyeSize[size]}
            ry={eyeSize[size] * 0.5}
            fill="#2a2a32"
            opacity="0.8"
          />
        )}

        {/* Right Eye */}
        {eyeExpression.shape === 'circle' ? (
          <circle
            cx="58"
            cy={45 + eyeExpression.offsetY}
            r={eyeSize[size]}
            fill="#2a2a32"
            opacity="0.8"
          />
        ) : (
          <ellipse
            cx="58"
            cy={45 + eyeExpression.offsetY}
            rx={eyeSize[size]}
            ry={eyeSize[size] * 0.5}
            fill="#2a2a32"
            opacity="0.8"
          />
        )}

        {/* Eye highlights */}
        <circle cx="44" cy={43 + eyeExpression.offsetY} r={eyeSize[size] * 0.3} fill="white" opacity="0.9" />
        <circle cx="60" cy={43 + eyeExpression.offsetY} r={eyeSize[size] * 0.3} fill="white" opacity="0.9" />

        {/* Nose/Mouth area - small subtle curve */}
        {personality.mood === 'happy' && (
          <path
            d="M 45 60 Q 50 65 55 60"
            stroke="#2a2a32"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}