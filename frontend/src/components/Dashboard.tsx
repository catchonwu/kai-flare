import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import LopCharacter, { LopPersonality } from './LopCharacter';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import ThoughtsApi from '../api/thoughts';
import { Heart, Edit3, Clock, Sparkles } from 'lucide-react';

interface WhisperCard {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
}

interface DashboardProps {
  selectedLop: LopPersonality;
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ selectedLop, onNavigate }: DashboardProps) {
  const [thoughtText, setThoughtText] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Mock recent whispers received
  const recentWhispers: WhisperCard[] = [
    {
      id: '1',
      content: 'Someone out there felt overwhelmed by Monday mornings too... You\'re not alone in finding new weeks challenging. 💚',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      mood: 'understanding'
    },
    {
      id: '2',
      content: 'A fellow soul shared that small victories matter... Even tiny steps forward are worth celebrating. ✨',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      mood: 'encouraging'
    },
    {
      id: '3',
      content: 'Someone felt grateful for unexpected kindness today... The world has gentle moments waiting to surprise us. 🌸',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      mood: 'warm'
    }
  ];

  const handleShare = async () => {
    if (!thoughtText.trim()) return;
    
    setIsSharing(true);
    setShareError(null);
    
    try {
      if (isAuthenticated) {
        // Use real API when authenticated
        await ThoughtsApi.create(thoughtText.trim());
      } else {
        // Simulate for guest users
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setThoughtText('');
      // Could show success message here
    } catch (error) {
      console.error('Error sharing thought:', error);
      setShareError('Failed to share your thought. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/10 via-background to-peachy/10">
      {/* Header with Theme Toggle and Lop */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good to see you</h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <LopCharacter 
                personality={selectedLop} 
                size="md" 
                animated={isSharing}
                className="cursor-pointer"
                onClick={() => onNavigate('lop')}
              />
              {isSharing && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-coral animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="px-6 pb-6">
        <Card className="p-4 bg-white/80 dark:bg-card/80 border-mint/10 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Edit3 className="w-4 h-4" />
              <span>{selectedLop.name} is listening...</span>
            </div>
            
            <Textarea
              value={thoughtText}
              onChange={(e) => {
                setThoughtText(e.target.value);
                if (shareError) setShareError(null); // Clear error when typing
              }}
              placeholder="What's on your mind today?"
              className="min-h-24 border-none bg-transparent text-base resize-none focus:ring-0 placeholder:text-muted-foreground/60"
            />
            
            {shareError && (
              <div className="p-3 bg-coral/10 border border-coral/20 rounded-lg text-sm text-coral">
                {shareError}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {thoughtText.length}/500
              </span>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md border-peachy/30 text-peachy hover:bg-peachy/10"
                  disabled={!thoughtText.trim() || isSharing}
                >
                  Save Draft
                </Button>
                
                <Button
                  onClick={handleShare}
                  disabled={!thoughtText.trim() || isSharing}
                  className="bg-coral hover:bg-coral/90 text-white rounded-md px-6"
                  size="sm"
                >
                  {isSharing ? 'Sharing...' : 'Share with Lop'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Whispers */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent whispers</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate('whispers')}
            className="text-coral hover:text-coral/80"
          >
            See all
          </Button>
        </div>

        <div className="space-y-3">
          {recentWhispers.slice(0, 3).map((whisper) => (
            <Card 
              key={whisper.id}
              className="p-4 bg-white/70 dark:bg-white/5 border border-lavender/10 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{whisper.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(whisper.timestamp)}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-coral hover:text-coral/80 hover:bg-coral/10"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-24" />
    </div>
  );
}