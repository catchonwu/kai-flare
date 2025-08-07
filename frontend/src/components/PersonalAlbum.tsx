import React, { useState } from 'react';
import type { Memory } from '@/types';

const PersonalAlbum: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const memories: Memory[] = [
    {
      id: '1',
      content: 'Feeling grateful for the small moments today. The way sunlight hit my coffee cup this morning made everything feel peaceful.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      mood: 'grateful',
      tags: ['morning', 'peace', 'gratitude'],
      isHighlight: true
    },
    {
      id: '2',
      content: 'Had a difficult conversation with mom. Sometimes growth means having uncomfortable conversations. I think we both learned something.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      mood: 'contemplative',
      tags: ['family', 'growth', 'relationships'],
      isHighlight: false
    },
    {
      id: '3',
      content: 'Finished reading that book I\'ve been putting off for months. Sometimes the things we avoid most are exactly what we need.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      mood: 'accomplished',
      tags: ['reading', 'achievement', 'self-care'],
      isHighlight: true
    },
    {
      id: '4',
      content: 'Feeling overwhelmed by all the decisions I need to make. Sometimes I wish life came with clearer directions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      mood: 'anxious',
      tags: ['decisions', 'uncertainty', 'growth'],
      isHighlight: false
    },
    {
      id: '5',
      content: 'Walked in the rain without an umbrella and it felt liberating. Sometimes we need to let go of control and just experience life.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      mood: 'free',
      tags: ['nature', 'freedom', 'mindfulness'],
      isHighlight: true
    }
  ];

  const moodFilters = [
    { label: 'All', value: null, color: 'text-muted-foreground' },
    { label: 'Grateful', value: 'grateful', color: 'text-peachy-pink' },
    { label: 'Contemplative', value: 'contemplative', color: 'text-lavender' },
    { label: 'Accomplished', value: 'accomplished', color: 'text-mint-green' },
    { label: 'Anxious', value: 'anxious', color: 'text-warm-coral' },
  ];

  const getMoodGradient = (mood: string) => {
    const gradients = {
      grateful: 'from-peachy-pink/30 to-peachy-pink/10',
      contemplative: 'from-lavender/30 to-lavender/10',
      accomplished: 'from-mint-green/30 to-mint-green/10',
      anxious: 'from-warm-coral/20 to-warm-coral/10',
      free: 'from-mint-green/20 to-lavender/20',
      restless: 'from-lavender/20 to-warm-coral/20'
    };
    return gradients[mood as keyof typeof gradients] || 'from-white/50 to-white/30';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = !selectedMood || memory.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-peachy-pink/10 via-background to-mint-green/10 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <span className="text-peachy-pink">📖</span>
            <span>Your Journey</span>
          </h1>
          <p className="text-muted-foreground">A gentle record of your thoughts and growth</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your memories..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-peachy-pink/20 bg-white/50 thought-input"
          />
        </div>

        {/* Mood Filters */}
        <div className="flex space-x-2 overflow-x-auto py-2">
          {moodFilters.map((filter) => (
            <button
              key={filter.value || 'all'}
              onClick={() => setSelectedMood(filter.value)}
              className={`rounded-xl whitespace-nowrap px-4 py-2 text-sm font-medium transition-all ${
                selectedMood === filter.value
                  ? 'bg-warm-coral text-white'
                  : `border border-peachy-pink/30 ${filter.color} hover:bg-peachy-pink/10 bg-white/50`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Highlights Section */}
      {!selectedMood && !searchQuery && (
        <div className="px-6 pb-6">
          <h2 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <span className="text-warm-coral">❤️</span>
            <span>Memory Highlights</span>
          </h2>
          <div className="flex space-x-3 overflow-x-auto py-2">
            {memories.filter(m => m.isHighlight).map((memory) => (
              <div
                key={memory.id}
                className={`min-w-72 p-4 bg-gradient-to-br ${getMoodGradient(memory.mood)} border-white/20 rounded-2xl card-pastel`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/50">
                      {memory.mood}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span>📅</span>
                      <span>{formatDate(memory.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3">
                    {memory.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Memories */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-medium">
          {selectedMood || searchQuery ? 'Filtered Memories' : 'All Memories'}
        </h2>

        {filteredMemories.map((memory) => (
          <div
            key={memory.id}
            className={`p-5 bg-gradient-to-br ${getMoodGradient(memory.mood)} border-white/20 rounded-2xl hover:shadow-lg transition-all duration-300 card-pastel`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-white/50">
                    {memory.mood}
                  </span>
                  {memory.isHighlight && (
                    <span className="text-warm-coral">❤️</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span>📅</span>
                  <span>{formatDate(memory.timestamp)}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm leading-relaxed text-foreground/90">
                {memory.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-lg text-xs bg-white/30 border border-white/40 text-foreground/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredMemories.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <span className="text-6xl text-muted-foreground/50">📖</span>
            <div>
              <h3 className="font-medium text-muted-foreground">No memories found</h3>
              <p className="text-sm text-muted-foreground/70">
                {searchQuery || selectedMood 
                  ? 'Try adjusting your search or filters'
                  : 'Start sharing your thoughts to build your journey'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAlbum;