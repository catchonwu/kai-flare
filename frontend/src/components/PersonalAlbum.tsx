import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Book, Search, Calendar, Heart, Smile, CloudRain, Sun, Moon } from 'lucide-react';

interface MemoryEntry {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  tags: string[];
  isHighlight: boolean;
}

export default function PersonalAlbum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const memories: MemoryEntry[] = [
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
    },
    {
      id: '6',
      content: 'Had trouble sleeping again. My mind won\'t quiet down. Maybe tomorrow I\'ll try that meditation app.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      mood: 'restless',
      tags: ['sleep', 'anxiety', 'self-care'],
      isHighlight: false
    }
  ];

  const moodFilters = [
    { label: 'All', value: null, icon: Heart, color: 'text-muted-foreground' },
    { label: 'Grateful', value: 'grateful', icon: Sun, color: 'text-peachy' },
    { label: 'Contemplative', value: 'contemplative', icon: Moon, color: 'text-lavender' },
    { label: 'Accomplished', value: 'accomplished', icon: Smile, color: 'text-mint' },
    { label: 'Anxious', value: 'anxious', icon: CloudRain, color: 'text-coral' },
  ];

  const getMoodGradient = (mood: string) => {
    const gradients = {
      grateful: 'from-peachy/30 to-peachy/10',
      contemplative: 'from-lavender/30 to-lavender/10',
      accomplished: 'from-mint/30 to-mint/10',
      anxious: 'from-coral/20 to-coral/10',
      free: 'from-mint/20 to-lavender/20',
      restless: 'from-lavender/20 to-coral/20'
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
    <div className="min-h-screen bg-gradient-to-br from-peachy/10 via-background to-mint/10 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <Book className="w-6 h-6 text-peachy" />
            <span>Your Journey</span>
          </h1>
          <p className="text-muted-foreground">A gentle record of your thoughts and growth</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your memories..."
            className="pl-10 rounded-lg border-peachy/10 bg-white/60 shadow-sm"
          />
        </div>

        {/* Mood Filters */}
        <div className="flex space-x-2 overflow-x-auto py-2">
          {moodFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.value || 'all'}
                variant={selectedMood === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMood(filter.value)}
                className={`rounded-md whitespace-nowrap ${
                  selectedMood === filter.value
                    ? 'bg-coral text-white'
                    : `border-peachy/30 ${filter.color} hover:bg-peachy/10`
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Highlights Section */}
      {!selectedMood && !searchQuery && (
        <div className="px-6 pb-6">
          <h2 className="text-lg font-medium mb-3 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-coral" />
            <span>Memory Highlights</span>
          </h2>
          <div className="flex space-x-3 overflow-x-auto py-2">
            {memories.filter(m => m.isHighlight).map((memory) => (
              <Card
                key={memory.id}
                className={`min-w-72 p-4 bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg shadow-sm`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs bg-white/50">
                      {memory.mood}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(memory.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-3">
                    {memory.content}
                  </p>
                </div>
              </Card>
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
          <Card
            key={memory.id}
            className={`p-4 bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg hover:shadow-md transition-all duration-200`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-white/50 capitalize">
                    {memory.mood}
                  </Badge>
                  {memory.isHighlight && (
                    <Heart className="w-4 h-4 text-coral fill-current" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
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
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-white/30 border-white/40 text-foreground/70"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {filteredMemories.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <Book className="w-12 h-12 text-muted-foreground/50 mx-auto" />
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
}