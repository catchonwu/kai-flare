import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Heart,
  Search,
  Filter,
  Cloud,
  Sparkles,
  Clock,
} from "lucide-react";

interface Whisper {
  id: string;
  content: string;
  timestamp: Date;
  mood: string;
  reactions: number;
  hasReacted: boolean;
}

export default function WhispersFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [whispers, setWhispers] = useState<Whisper[]>([
    {
      id: "1",
      content:
        "Someone out there felt the weight of comparison today... Remember, everyone's journey unfolds at its own perfect pace. Your path is uniquely beautiful. 🌱",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      mood: "understanding",
      reactions: 23,
      hasReacted: false,
    },
    {
      id: "2",
      content:
        "A fellow soul shared gratitude for unexpected kindness from a stranger... Small acts of care ripple through the world in ways we never see. ✨",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      mood: "grateful",
      reactions: 41,
      hasReacted: true,
    },
    {
      id: "3",
      content:
        "Someone felt overwhelmed by all the choices life presents... It's okay to not have it all figured out. Uncertainty can be a doorway to possibility. 🦋",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      mood: "contemplative",
      reactions: 18,
      hasReacted: false,
    },
    {
      id: "4",
      content:
        "A gentle spirit found comfort in the sound of rain today... Nature has a way of washing our worries and bringing peace to restless hearts. 🌧️",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      mood: "peaceful",
      reactions: 35,
      hasReacted: false,
    },
    {
      id: "5",
      content:
        "Someone realized they've been too hard on themselves lately... Self-compassion is not selfish—it's the foundation of genuine healing. 💚",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      mood: "healing",
      reactions: 52,
      hasReacted: true,
    },
    {
      id: "6",
      content:
        "A thoughtful soul felt connection while watching clouds change shapes... We're all part of the same sky, constantly transforming together. ☁️",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      mood: "connected",
      reactions: 29,
      hasReacted: false,
    },
  ]);

  const handleReaction = (whisperId: string) => {
    setWhispers((prev) =>
      prev.map((whisper) =>
        whisper.id === whisperId
          ? {
              ...whisper,
              hasReacted: !whisper.hasReacted,
              reactions: whisper.hasReacted
                ? whisper.reactions - 1
                : whisper.reactions + 1,
            }
          : whisper,
      ),
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

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
      understanding: "from-mint/30 to-mint/10",
      grateful: "from-peachy/30 to-peachy/10",
      contemplative: "from-lavender/30 to-lavender/10",
      peaceful: "from-mint/20 to-lavender/20",
      healing: "from-coral/20 to-mint/20",
      connected: "from-peachy/20 to-lavender/30",
    };
    return (
      colors[mood as keyof typeof colors] ||
      "from-white/50 to-white/30"
    );
  };

  const filteredWhispers = whispers.filter(
    (whisper) =>
      whisper.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      whisper.mood
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/10 via-background to-mint/10 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <Cloud className="w-6 h-6 text-lavender" />
            <span>Gentle Whispers</span>
          </h1>
          <p className="text-muted-foreground">
            Anonymous comfort from fellow souls
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="pl-10 rounded-lg border-lavender/10 bg-white/60 shadow-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Whispers Feed */}
      <div className="px-6 space-y-4">
        {filteredWhispers.map((whisper) => (
          <Card
            key={whisper.id}
            className={`p-4 bg-white/70 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg hover:shadow-md transition-all duration-200`}
          >
            <div className="space-y-4">
              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-coral/60" />
                  <span className="text-xs font-medium text-coral/80 capitalize">
                    {whisper.mood}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {whisper.content}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTimeAgo(whisper.timestamp)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {whisper.reactions}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(whisper.id)}
                    className={`h-8 w-8 p-0 rounded-full transition-all ${
                      whisper.hasReacted
                        ? "text-coral bg-coral/10 hover:bg-coral/20"
                        : "text-muted-foreground hover:text-coral hover:bg-coral/10"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${whisper.hasReacted ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredWhispers.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <Cloud className="w-12 h-12 text-muted-foreground/50 mx-auto" />
            <div>
              <h3 className="font-medium text-muted-foreground">
                No whispers found
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Try adjusting your search
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}