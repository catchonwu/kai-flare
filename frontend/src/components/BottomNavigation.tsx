import React from 'react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'album', label: 'Album', icon: '📖' },
    { id: 'whispers', label: 'Whispers', icon: '💌' },
    { id: 'lop', label: 'Lop', icon: '❤️' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/20">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-warm-coral bg-warm-coral/10' 
                  : 'text-muted-foreground hover:text-warm-coral/70'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;