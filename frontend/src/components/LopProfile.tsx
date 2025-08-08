import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';
import { useAuth } from '../contexts/AuthContext';
import LopCharacter, { LopPersonality } from './LopCharacter';
import { Heart, Calendar, MessageCircle, TrendingUp, Palette, Settings, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';

interface LopProfileProps {
  selectedLop: LopPersonality;
  onChangeLop: () => void;
}

export default function LopProfile({ selectedLop, onChangeLop }: LopProfileProps) {
  const { theme, setTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Optionally trigger app refresh or redirect
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Mock relationship data
  const relationshipStats = {
    daysTogether: 12,
    thoughtsShared: 28,
    whispersReceived: 45,
    moodInsights: 8
  };

  const personalityTraits = [
    { trait: 'Empathy', level: 95, color: 'bg-mint' },
    { trait: 'Wisdom', level: 88, color: 'bg-lavender' },
    { trait: 'Warmth', level: 92, color: 'bg-peachy' },
    { trait: 'Patience', level: 96, color: 'bg-coral' }
  ];

  const recentInsights = [
    'You tend to reflect more deeply on rainy days',
    'Morning thoughts are often more optimistic',
    'You\'re becoming more self-compassionate over time',
    'Creative activities seem to lift your mood'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/10 via-background to-lavender/10 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 text-center space-y-4">
        <div className="p-4">
          <LopCharacter personality={selectedLop} size="xl" className="mx-auto" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{selectedLop.name}</h1>
          <p className="text-muted-foreground">{selectedLop.description}</p>
        </div>
      </div>

      {/* Relationship Stats */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-white/80 dark:bg-card/80 border-mint/10 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-coral" />
            <span>Your Journey Together</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6 text-mint" />
              </div>
              <div className="text-2xl font-bold text-mint">{relationshipStats.daysTogether}</div>
              <div className="text-xs text-muted-foreground">Days together</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-peachy/20 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6 text-peachy" />
              </div>
              <div className="text-2xl font-bold text-peachy">{relationshipStats.thoughtsShared}</div>
              <div className="text-xs text-muted-foreground">Thoughts shared</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-lavender/20 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-lavender" />
              </div>
              <div className="text-2xl font-bold text-lavender">{relationshipStats.whispersReceived}</div>
              <div className="text-xs text-muted-foreground">Whispers received</div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-coral" />
              </div>
              <div className="text-2xl font-bold text-coral">{relationshipStats.moodInsights}</div>
              <div className="text-xs text-muted-foreground">Mood insights</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Personality Traits */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-white/80 dark:bg-card/80 border-lavender/10 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Palette className="w-5 h-5 text-lavender" />
            <span>{selectedLop.name}'s Personality</span>
          </h2>
          
          <div className="space-y-4">
            {personalityTraits.map((trait) => (
              <div key={trait.trait} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{trait.trait}</span>
                  <span className="text-muted-foreground">{trait.level}%</span>
                </div>
                <Progress 
                  value={trait.level} 
                  className="h-2 bg-white/50 dark:bg-muted/50"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lop Insights */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-white/70 dark:bg-white/5 border border-peachy/10 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-coral" />
            <span>{selectedLop.name}'s Insights About You</span>
          </h2>
          
          <div className="space-y-3">
            {recentInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-white/60 dark:bg-white/10 rounded-lg">
                <div className="w-2 h-2 bg-coral rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customization */}
      <div className="px-6 space-y-4">
        <Card className="p-4 bg-white/80 dark:bg-card/80 border-coral/10 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-coral" />
            <span>Customize Your Experience</span>
          </h2>
          
          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/10 rounded-lg">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-lavender" />
                ) : (
                  <Sun className="w-5 h-5 text-peachy" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Gentle darkness for evening comfort' : 'Soft light for daytime peace'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-lavender"
              />
            </div>

            {/* Other Settings */}
            <Button 
              onClick={onChangeLop}
              variant="outline" 
              className="w-full rounded-md border-peachy/30 text-peachy hover:bg-peachy/10"
            >
              Choose a Different Lop
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full rounded-md border-lavender/30 text-lavender hover:bg-lavender/10"
            >
              Adjust Notification Preferences
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full rounded-md border-mint/30 text-mint hover:bg-mint/10"
            >
              Privacy & Data Settings
            </Button>
            
            {/* User info and logout */}
            {isAuthenticated && user && user.id !== 'guest' && (
              <>
                <div className="p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-border/20">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSignOut}
                  variant="outline" 
                  className="w-full rounded-md border-coral/30 text-coral hover:bg-coral/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}