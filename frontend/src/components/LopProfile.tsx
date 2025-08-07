import React from 'react';
import LopCharacter from './LopCharacter';
import type { LopPersonality } from '@/types';

interface LopProfileProps {
  selectedLop: LopPersonality;
  onChangeLop: () => void;
}

const LopProfile: React.FC<LopProfileProps> = ({ selectedLop, onChangeLop }) => {
  return (
    <div className="p-4 max-w-2xl mx-auto text-center min-h-screen bg-gradient-to-br from-mint-green/10 via-background to-peachy-pink/10">
      <div className="pt-8">
        <LopCharacter
          personality={selectedLop}
          size="xl"
          animated={true}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">Meet {selectedLop.name}</h2>
        <p className="text-lg mb-6 text-muted-foreground">{selectedLop.description}</p>
      </div>

      <div className="card-pastel p-6 mb-6">
        <p className="mb-4 leading-relaxed">
          {selectedLop.name} is your AI companion who listens to your thoughts and helps create connections through the whisper network.
        </p>
        <p className="leading-relaxed">
          Every thought you share helps someone else feel less alone, and their thoughts might just be the whisper you need to hear today.
        </p>
      </div>

      <button
        onClick={onChangeLop}
        className="px-6 py-3 bg-warm-coral hover:bg-warm-coral/90 text-white rounded-xl font-medium transition-colors"
      >
        Choose Different Lop
      </button>

      <div className="h-24" />
    </div>
  );
};

export default LopProfile;