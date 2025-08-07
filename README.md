# Solilop MVP

AI companion app where users share thoughts with "Lop" characters that create anonymous emotional connections through a whisper network.

## Features

- **Thought Sharing**: Share your thoughts with your personal Lop companion
- **Sentiment Analysis**: Automatic detection of emotional tone in thoughts
- **Whisper Network**: Anonymous encouraging messages sent between users with complementary emotional states
- **Lop Characters**: Choose from 5 different Lop personalities as your companion
- **Thought Album**: Track and review your emotional journey over time

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS (CDN-based for MVP)
- **Backend**: Cloudflare Workers + Hono
- **Database**: Cloudflare D1 (SQLite)
- **Session Storage**: Cloudflare KV
- **Deployment**: Cloudflare Pages + Workers

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd solilop-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the D1 database locally:
```bash
npm run db:local
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8787`

### Deployment

1. Create a D1 database in Cloudflare:
```bash
wrangler d1 create solilop-db
```

2. Update `wrangler.toml` with your database ID

3. Initialize the production database:
```bash
npm run db:init
```

4. Deploy to Cloudflare:
```bash
npm run deploy
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Thoughts
- `POST /api/thoughts` - Create new thought
- `GET /api/thoughts` - Get user's thoughts

### Whispers
- `GET /api/whispers` - Get received whispers
- `PUT /api/whispers/:id/read` - Mark whisper as read

### Lop
- `GET /api/lop/response` - Get Lop companion response

## Security Notes

This MVP uses simplified authentication and password hashing for demonstration purposes. For production use:
- Implement proper JWT library
- Use bcrypt or similar for password hashing
- Add rate limiting
- Implement proper CORS policies
- Use environment-specific secrets

## License

MIT