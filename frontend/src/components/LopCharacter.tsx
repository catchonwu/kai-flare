import React from 'react';
import type { LopPersonality } from '@/types';

interface LopCharacterProps {
  personality: LopPersonality;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

const LopCharacter: React.FC<LopCharacterProps> = ({ 
  personality, 
  size = 'md', 
  animated = false,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const earSize = {
    sm: { width: 12, height: 20 },
    md: { width: 18, height: 30 },
    lg: { width: 24, height: 40 },
    xl: { width: 36, height: 60 }
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
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center relative ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${animated ? 'animate-pulse' : ''}`}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
      >
        {/* Left Ear */}
        <ellipse
          cx="25"
          cy="35"
          rx={earSize[size].width}
          ry={earSize[size].height}
          fill={personality.primaryColor}
          transform="rotate(-20 25 35)"
          opacity="0.9"
        />
        <ellipse
          cx="25"
          cy="35"
          rx={earSize[size].width * 0.6}
          ry={earSize[size].height * 0.7}
          fill={personality.secondaryColor}
          transform="rotate(-20 25 35)"
          opacity="0.7"
        />

        {/* Right Ear */}
        <ellipse
          cx="75"
          cy="35"
          rx={earSize[size].width}
          ry={earSize[size].height}
          fill={personality.primaryColor}
          transform="rotate(20 75 35)"
          opacity="0.9"
        />
        <ellipse
          cx="75"
          cy="35"
          rx={earSize[size].width * 0.6}
          ry={earSize[size].height * 0.7}
          fill={personality.secondaryColor}
          transform="rotate(20 75 35)"
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
};

export default LopCharacter;