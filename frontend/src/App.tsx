import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import WhispersFeed from './components/WhispersFeed';
import PersonalAlbum from './components/PersonalAlbum';
import LopProfile from './components/LopProfile';
import BottomNavigation from './components/BottomNavigation';
import { LopPersonality } from './components/LopCharacter';

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
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Onboarding onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
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
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        {renderScreen()}
        <BottomNavigation activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </ThemeProvider>
  );
}