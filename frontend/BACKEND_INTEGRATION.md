# Backend Integration Guide

This document explains how the frontend connects to the backend API for authentication and thoughts functionality.

## Overview

The frontend now connects to the real backend API running on Cloudflare Workers with the following integrations:

1. **Authentication** - User registration and login
2. **Thoughts** - Sharing thoughts with Lop companions that get processed for sentiment analysis

## API Structure

### Base Configuration
- **API Base URL**: `/api` (proxies to backend in development)
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Custom ApiError class for consistent error handling

### Endpoints Used

#### Authentication (`/api/auth/`)
- `POST /api/auth/register` - User registration with Lop character selection
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check endpoint

#### Thoughts (`/api/thoughts/`)
- `POST /api/thoughts` - Create new thought (requires authentication)
- `GET /api/thoughts` - Get user's thoughts (requires authentication)

## Integration Components

### 1. API Client (`src/api/client.ts`)
Centralized HTTP client with:
- Automatic JWT token management
- Request/response interceptors
- Type-safe interfaces
- Error handling with custom `ApiError` class

### 2. AuthContext (`src/contexts/AuthContext.tsx`)
Enhanced authentication context that:
- Integrates with real backend API
- Maps frontend Lop personalities to backend characters
- Manages JWT tokens and user sessions
- Handles authentication state persistence

### 3. Thoughts API (`src/api/thoughts.ts`)
Dedicated service for thought-related operations:
- Create thoughts with sentiment analysis
- Retrieve user thought history
- Type-safe request/response handling

### 4. Dashboard Integration (`src/components/Dashboard.tsx`)
Updated dashboard that:
- Uses real API for sharing thoughts when authenticated
- Falls back to simulation for guest users
- Displays API errors with user-friendly messages
- Clears errors automatically when user types

## Data Flow

### Authentication Flow
1. **Onboarding**: User selects Lop personality
2. **Registration**: Frontend maps Lop personality to backend character
3. **API Call**: Backend creates user with selected Lop character
4. **Token Storage**: JWT token stored in localStorage and API client
5. **Session Persistence**: Token restored on app reload

### Thought Sharing Flow
1. **User Input**: User types thought in Dashboard
2. **Authentication Check**: Verify user is authenticated
3. **API Call**: Send thought to backend for sentiment analysis
4. **Processing**: Backend analyzes sentiment and creates whispers
5. **Response**: Frontend shows success/error feedback

### Lop Character Mapping
Frontend personalities are mapped to backend characters:
- `bloom` → `happy_lop`
- `dream` → `zen_lop` 
- `sunny` → `playful_lop`
- `coral` → `curious_lop`

## Configuration

### Authentication Config (`src/config/auth.ts`)
```typescript
export const AUTH_CONFIG = {
  enabled: true,  // Enable/disable authentication
  demo: {
    email: 'demo@solilop.com',
    password: 'demo123'
  }
};
```

### API Config (`src/config/api.ts`)
```typescript
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 10000,
  enableLogging: process.env.NODE_ENV === 'development'
};
```

## Development vs Production

### Development Mode
- API requests go to `/api` which should proxy to your local backend
- Health checks enabled to monitor backend connectivity
- Enhanced logging for debugging
- Fallback to guest mode if backend unavailable

### Production Mode
- API requests go to same origin `/api` endpoints
- JWT tokens securely stored in localStorage
- Error boundaries handle API failures gracefully
- Optimized bundle with tree-shaking

## Error Handling

### API Errors
- Network errors: "Connection failed" message
- Authentication errors: Redirect to login
- Validation errors: Form-specific error messages
- Server errors: Generic "Please try again" message

### Graceful Degradation
- **Guest Mode**: All features work without authentication
- **Offline Mode**: Local storage for draft thoughts
- **API Unavailable**: UI shows connection status
- **Token Expiry**: Automatic logout and re-authentication prompt

## Testing the Integration

### Health Check
Use the `ApiStatus` component to monitor backend connectivity:

```tsx
import ApiStatus from './components/ApiStatus';

// Shows connection status in UI
<ApiStatus className="fixed bottom-4 right-4" />
```

### Demo Authentication
Test with provided credentials:
- Email: `demo@solilop.com`
- Password: `demo123`

### Thought Sharing
1. Complete onboarding to select a Lop
2. Authenticate (or continue as guest)
3. Share a thought in the Dashboard
4. Check network tab for API calls

## Troubleshooting

### Common Issues

1. **"ApiError is not exported"**
   - Ensure `export { ApiError };` is in `src/api/client.ts`

2. **"Unauthorized" errors**
   - Check JWT token is stored in localStorage
   - Verify token is valid and not expired
   - Clear localStorage and re-authenticate

3. **Network errors**
   - Verify backend is running
   - Check CORS configuration
   - Confirm API endpoints are accessible

4. **Type errors**
   - Ensure backend types match frontend interfaces
   - Check Lop character mapping is correct
   - Verify API response shapes

### Debug Steps
1. Open browser developer tools
2. Check Network tab for API calls
3. Inspect localStorage for auth tokens
4. Look at Console for error messages
5. Use ApiStatus component for connectivity

## Security Notes

- JWT tokens are stored in localStorage (development only)
- For production, consider httpOnly cookies
- API client includes CORS headers
- All API requests use HTTPS in production
- Sensitive operations require authentication

## Future Enhancements

- Real-time WebSocket connections for whispers
- Offline-first architecture with sync
- Push notifications for new whispers
- Enhanced error recovery mechanisms
- Performance monitoring and analytics