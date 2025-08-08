import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import WhispersFeed from './components/WhispersFeed';
import PersonalAlbum from './components/PersonalAlbum';
import LopProfile from './components/LopProfile';
import BottomNavigation from './components/BottomNavigation';
import { LopPersonality } from './components/LopCharacter';
import AUTH_CONFIG from './config/auth';

function AppContent() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [selectedLop, setSelectedLop] = useState<LopPersonality | null>(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [showAuthAfterOnboarding, setShowAuthAfterOnboarding] = useState(false);

  const { isAuthenticated } = useAuth();

  // Hide auth screen if user becomes authenticated (e.g., through localStorage)
  useEffect(() => {
    if (isAuthenticated && showAuthAfterOnboarding) {
      setShowAuthAfterOnboarding(false);
    }
  }, [isAuthenticated, showAuthAfterOnboarding]);

  const handleOnboardingComplete = (lop: LopPersonality) => {
    setSelectedLop(lop);
    setIsOnboardingComplete(true);
    
    // Show auth after onboarding if enabled and user not authenticated
    if (AUTH_CONFIG.enabled && !isAuthenticated) {
      setShowAuthAfterOnboarding(true);
    }
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleChangeLop = () => {
    setIsOnboardingComplete(false);
    setActiveScreen('home');
    setShowAuthAfterOnboarding(false);
  };

  // Handle skipping authentication after onboarding
  const handleSkipAuth = () => {
    setShowAuthAfterOnboarding(false);
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthAfterOnboarding(false);
  };

  // Show onboarding if not completed
  if (!isOnboardingComplete || !selectedLop) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show auth screen after onboarding if authentication is enabled and user is not authenticated
  if (showAuthAfterOnboarding) {
    return <Auth onSkipAuth={handleSkipAuth} onAuthSuccess={handleAuthSuccess} showAsPostOnboarding={true} />;
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

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider enabled={AUTH_CONFIG.enabled}>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}