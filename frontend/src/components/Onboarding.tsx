import React, { useState } from 'react';
import LopCharacter from './LopCharacter';
import type { LopPersonality } from '@/types';
import { LOP_PERSONALITIES } from '@/utils/constants';

interface OnboardingProps {
  onComplete: (selectedLop: LopPersonality) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLop, setSelectedLop] = useState<LopPersonality | null>(null);

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else if (selectedLop) {
      onComplete(selectedLop);
    }
  };

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-mint-green/20 via-background to-peachy-pink/20">
      <div className="text-center space-y-8 max-w-sm mx-auto">
        {/* Logo/App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">
            Solilop
          </h1>
          <p className="text-lg text-muted-foreground">Every thought finds an ear</p>
        </div>

        {/* Hero Lop */}
        <div className="relative">
          <LopCharacter 
            personality={LOP_PERSONALITIES[0]} 
            size="xl" 
            animated={true}
            className="mx-auto"
          />
          <div className="absolute -top-2 -right-2">
            <span className="text-2xl animate-pulse">✨</span>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            A gentle space where your thoughts meet caring ears
          </p>
          <button 
            onClick={nextStep}
            className="w-full bg-warm-coral hover:bg-warm-coral/90 text-white rounded-2xl h-12 font-semibold transition-all"
          >
            Get Started
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HowItWorksScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-lavender/20 via-background to-mint-green/20">
      <div className="space-y-8 max-w-sm mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="text-muted-foreground">Three simple steps to gentle connection</p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl border border-mint-green/20">
            <div className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💬</span>
            </div>
            <div>
              <h3 className="font-medium">Share with your Lop</h3>
              <p className="text-sm text-muted-foreground">Tell your thoughts to your caring companion</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl border border-lavender/20">
            <div className="w-12 h-12 bg-lavender rounded-full flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-medium">Lop whispers feelings</h3>
              <p className="text-sm text-muted-foreground">Your emotions reach others anonymously</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl border border-peachy-pink/20">
            <div className="w-12 h-12 bg-peachy-pink rounded-full flex items-center justify-center">
              <span className="text-white text-xl">❤️</span>
            </div>
            <div>
              <h3 className="font-medium">Receive gentle echoes</h3>
              <p className="text-sm text-muted-foreground">Feel comfort from others' shared experiences</p>
            </div>
          </div>
        </div>

        <button 
          onClick={nextStep}
          className="w-full bg-warm-coral hover:bg-warm-coral/90 text-white rounded-2xl h-12 font-semibold transition-all"
        >
          Continue
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );

  const ChooseLopScreen = () => (
    <div className="flex flex-col justify-center min-h-screen p-6 bg-gradient-to-br from-peachy-pink/20 via-background to-warm-coral/20">
      <div className="space-y-8 max-w-sm mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Choose your Lop</h2>
          <p className="text-muted-foreground">Pick a companion that feels right for you</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {LOP_PERSONALITIES.map((lop) => (
            <button
              key={lop.id}
              onClick={() => setSelectedLop(lop)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedLop?.id === lop.id
                  ? 'border-warm-coral bg-warm-coral/10 scale-105'
                  : 'border-gray-200 bg-white/50 hover:border-warm-coral/50'
              }`}
            >
              <LopCharacter personality={lop} size="lg" className="mx-auto mb-3" />
              <h3 className="font-medium text-sm">{lop.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{lop.description}</p>
            </button>
          ))}
        </div>

        {selectedLop && (
          <button 
            onClick={nextStep}
            className="w-full bg-warm-coral hover:bg-warm-coral/90 text-white rounded-2xl h-12 font-semibold transition-all"
          >
            This is my Lop
            <span className="ml-2">❤️</span>
          </button>
        )}
      </div>
    </div>
  );

  const screens = [WelcomeScreen, HowItWorksScreen, ChooseLopScreen];
  const CurrentScreen = screens[currentStep];

  return <CurrentScreen />;
};

export default Onboarding;