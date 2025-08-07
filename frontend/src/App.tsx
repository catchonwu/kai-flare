import React, { useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import WhispersFeed from './components/WhispersFeed';
import PersonalAlbum from './components/PersonalAlbum';
import LopProfile from './components/LopProfile';
import BottomNavigation from './components/BottomNavigation';
import type { LopPersonality } from './types';

export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [selectedLop, setSelectedLop] = useState<LopPersonality | null>(null);
  const [activeScreen, setActiveScreen] = useState('home');

  const handleOnboardingComplete = (lop: LopPersonality) => {
    setSelectedLop(lop);
    setIsOnboardingComplete(true);
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleChangeLop = () => {
    setIsOnboardingComplete(false);
    setActiveScreen('home');
  };

  // Show onboarding if not completed
  if (!isOnboardingComplete || !selectedLop) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render appropriate screen based on navigation
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Dashboard selectedLop={selectedLop} onNavigate={handleNavigate} />;
      case 'whispers':
        return <WhispersFeed />;
      case 'album':
        return <PersonalAlbum />;
      case 'lop':
        return <LopProfile selectedLop={selectedLop} onChangeLop={handleChangeLop} />;
      default:
        return <Dashboard selectedLop={selectedLop} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
    </div>
  );
}