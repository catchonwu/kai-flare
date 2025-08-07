# Solilop Frontend

This is the React frontend for the Solilop mental wellness platform, migrated from a monolithic HTML file to a proper component-based architecture.

## Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Components**: Modular, reusable components

## Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── LopCharacter.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Dashboard.tsx
│   │   ├── PersonalAlbum.tsx
│   │   ├── WhispersFeed.tsx
│   │   ├── LopProfile.tsx
│   │   └── BottomNavigation.tsx
│   ├── styles/           # CSS and styling
│   │   └── globals.css
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions and constants
│   │   └── constants.ts
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Design System

### Colors
- **Mint Green**: `#a8e6cf` - Primary calm color
- **Lavender**: `#c8a8e9` - Secondary gentle color  
- **Peachy Pink**: `#ffc3a0` - Warm accent color
- **Warm Coral**: `#ff8a80` - Action color
- **Soft Cream**: `#fefcf8` - Background color

### Components
- **LopCharacter**: Custom SVG rabbit characters with personalities
- **Cards**: Glass-morphism cards with backdrop blur
- **Gradients**: Mood-based gradient backgrounds
- **Typography**: Soft, rounded typography hierarchy

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Onboarding Flow**: 3-step welcome process with Lop selection
- **Dashboard**: Main thought sharing interface with your chosen Lop
- **Personal Album**: Memory management with search, filtering, and tags
- **Whispers Feed**: Community whispers with reactions
- **Lop Profile**: Information about your AI companion

## Integration

The frontend builds to `../public/` where it's served by the Cloudflare Workers backend. The build process generates optimized assets that are served statically while the API routes handle dynamic functionality.