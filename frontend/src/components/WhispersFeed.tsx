import React, { useState } from 'react';
import type { Whisper } from '@/types';

const WhispersFeed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [whispers, setWhispers] = useState<Whisper[]>([
    {
      id: '1',
      content: 'Someone out there felt the weight of comparison today... Remember, everyone\'s journey unfolds at its own perfect pace. Your path is uniquely beautiful. 🌱',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      mood: 'understanding',
      reactions: 23,
      hasReacted: false
    },
    {
      id: '2',
      content: 'A fellow soul shared gratitude for unexpected kindness from a stranger... Small acts of care ripple through the world in ways we never see. ✨',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      mood: 'grateful',
      reactions: 41,
      hasReacted: true
    },
    {
      id: '3',
      content: 'Someone felt overwhelmed by all the choices life presents... It\'s okay to not have it all figured out. Uncertainty can be a doorway to possibility. 🦋',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      mood: 'contemplative',
      reactions: 18,
      hasReacted: false
    },
    {
      id: '4',
      content: 'A gentle spirit found comfort in the sound of rain today... Nature has a way of washing our worries and bringing peace to restless hearts. 🌧️',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      mood: 'peaceful',
      reactions: 35,
      hasReacted: false
    },
    {
      id: '5',
      content: 'Someone realized they\'ve been too hard on themselves lately... Self-compassion is not selfish—it\'s the foundation of genuine healing. 💚',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      mood: 'healing',
      reactions: 52,
      hasReacted: true
    },
    {
      id: '6',
      content: 'A thoughtful soul felt connection while watching clouds change shapes... We\'re all part of the same sky, constantly transforming together. ☁️',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      mood: 'connected',
      reactions: 29,
      hasReacted: false
    }
  ]);

  const handleReaction = (whisperId: string) => {
    setWhispers(prev => prev.map(whisper => 
      whisper.id === whisperId 
        ? { 
            ...whisper, 
            hasReacted: !whisper.hasReacted,
            reactions: whisper.hasReacted ? whisper.reactions - 1 : whisper.reactions + 1
          }
        : whisper
    ));
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

  const getMoodColor = (mood: string) => {
    const colors = {
      understanding: 'from-mint-green/30 to-mint-green/10',
      grateful: 'from-peachy-pink/30 to-peachy-pink/10',
      contemplative: 'from-lavender/30 to-lavender/10',
      peaceful: 'from-mint-green/20 to-lavender/20',
      healing: 'from-warm-coral/20 to-mint-green/20',
      connected: 'from-peachy-pink/20 to-lavender/30'
    };
    return colors[mood as keyof typeof colors] || 'from-white/50 to-white/30';
  };

  const filteredWhispers = whispers.filter(whisper =>
    whisper.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    whisper.mood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/10 via-background to-mint-green/10 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <span className="text-lavender">☁️</span>
            <span>Gentle Whispers</span>
          </h1>
          <p className="text-muted-foreground">Anonymous comfort from fellow souls</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="w-full pl-10 pr-12 py-3 rounded-2xl border border-lavender/20 bg-white/50 thought-input"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-lg hover:bg-black/5 transition-colors">
            <span className="text-sm">🔍</span>
          </button>
        </div>
      </div>

      {/* Whispers Feed */}
      <div className="px-6 space-y-4">
        {filteredWhispers.map((whisper) => (
          <div 
            key={whisper.id}
            className={`p-5 bg-gradient-to-br ${getMoodColor(whisper.mood)} border-white/20 rounded-2xl hover:shadow-lg transition-all duration-300 backdrop-blur-sm card-pastel`}
          >
            <div className="space-y-4">
              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-warm-coral/60">✨</span>
                  <span className="text-xs font-medium text-warm-coral/80 capitalize">{whisper.mood}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {whisper.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>🕒</span>
                  <span>{formatTimeAgo(whisper.timestamp)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {whisper.reactions}
                  </span>
                  <button
                    onClick={() => handleReaction(whisper.id)}
                    className={`h-8 w-8 p-0 rounded-full transition-all ${
                      whisper.hasReacted
                        ? 'text-warm-coral bg-warm-coral/10 hover:bg-warm-coral/20'
                        : 'text-muted-foreground hover:text-warm-coral hover:bg-warm-coral/10'
                    }`}
                  >
                    <span className="text-sm">
                      {whisper.hasReacted ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredWhispers.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <span className="text-6xl text-muted-foreground/50">☁️</span>
            <div>
              <h3 className="font-medium text-muted-foreground">No whispers found</h3>
              <p className="text-sm text-muted-foreground/70">Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhispersFeed;