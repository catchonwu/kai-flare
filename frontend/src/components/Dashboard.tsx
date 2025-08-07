import React, { useState } from 'react';
import LopCharacter from './LopCharacter';
import type { LopPersonality, Whisper } from '@/types';

interface DashboardProps {
  selectedLop: LopPersonality;
  onNavigate: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedLop, onNavigate }) => {
  const [thoughtText, setThoughtText] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  // Mock recent whispers received
  const recentWhispers: Whisper[] = [
    {
      id: '1',
      content: 'Someone out there felt overwhelmed by Monday mornings too... You\'re not alone in finding new weeks challenging. 💚',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      mood: 'understanding',
      reactions: 23,
      hasReacted: false
    },
    {
      id: '2',
      content: 'A fellow soul shared that small victories matter... Even tiny steps forward are worth celebrating. ✨',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      mood: 'encouraging',
      reactions: 15,
      hasReacted: true
    },
    {
      id: '3',
      content: 'Someone felt grateful for unexpected kindness today... The world has gentle moments waiting to surprise us. 🌸',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      mood: 'warm',
      reactions: 31,
      hasReacted: false
    }
  ];

  const handleShare = async () => {
    if (!thoughtText.trim()) return;
    
    setIsSharing(true);
    
    // Simulate sharing animation
    setTimeout(() => {
      setIsSharing(false);
      setThoughtText('');
      // Could add a success message here
    }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-mint-green/10 via-background to-peachy-pink/10">
      {/* Header with Lop */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good to see you</h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>
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
                <span className="text-lg animate-spin">✨</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Input Area */}
      <div className="px-6 pb-6">
        <div className="card-pastel p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>✏️</span>
              <span>{selectedLop.name} is listening...</span>
            </div>
            
            <textarea
              value={thoughtText}
              onChange={(e) => setThoughtText(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full p-4 border-none bg-transparent text-base resize-none thought-input min-h-24"
              disabled={isSharing}
              maxLength={500}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {thoughtText.length}/500
              </span>
              
              <div className="flex space-x-2">
                <button
                  disabled={!thoughtText.trim() || isSharing}
                  className="px-4 py-2 rounded-xl border border-peachy-pink/50 text-peachy-pink hover:bg-peachy-pink/10 text-sm transition-all disabled:opacity-50"
                >
                  Save Draft
                </button>
                
                <button
                  onClick={handleShare}
                  disabled={!thoughtText.trim() || isSharing}
                  className="bg-warm-coral hover:bg-warm-coral/90 text-white rounded-xl px-6 py-2 text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {isSharing ? 'Sharing...' : 'Share with Lop'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Whispers */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent whispers</h2>
          <button 
            onClick={() => onNavigate('whispers')}
            className="text-sm text-warm-coral hover:text-warm-coral/80 transition-colors"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {recentWhispers.slice(0, 3).map((whisper) => (
            <div 
              key={whisper.id}
              className="p-4 bg-gradient-to-r from-white/60 to-lavender/20 border border-lavender/20 rounded-2xl hover:shadow-md transition-shadow card-pastel"
            >
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{whisper.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>🕒</span>
                    <span>{formatTimeAgo(whisper.timestamp)}</span>
                  </div>
                  
                  <button className="h-8 w-8 p-0 text-warm-coral hover:text-warm-coral/80 hover:bg-warm-coral/10 rounded-full transition-colors">
                    <span className="text-sm">❤️</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-24" />
    </div>
  );
};

export default Dashboard;