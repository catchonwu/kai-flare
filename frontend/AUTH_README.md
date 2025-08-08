# Optional Authentication System

The Solilop app includes an optional authentication system that can be easily enabled or disabled.

## Configuration

Authentication is controlled via the configuration file at `src/config/auth.ts`:

```typescript
export const AUTH_CONFIG = {
  // Enable/disable authentication
  enabled: false, // Set to true to enable auth, false for guest mode
  
  // Demo user credentials (for testing when auth is enabled)
  demo: {
    email: 'demo@solilop.com',
    password: 'demo123'
  },
  
  // Guest user info (when auth is disabled)
  guest: {
    name: 'Guest User',
    email: 'guest@solilop.com'
  }
};
```

## Modes

### Guest Mode (Default)
- **Configuration**: `enabled: false`
- **Behavior**: 
  - No authentication required
  - Users proceed directly to the app
  - All features work normally with a mock guest user
  - No login/signup screens shown

### Authentication Mode
- **Configuration**: `enabled: true`
- **Behavior**:
  - Users start with onboarding (can explore features first)
  - Auth screen shown after completing onboarding
  - Encouraging message to save their Lop companion and journey
  - Option to "Keep Exploring" as guest is available
  - User profiles and sessions are managed
  - Sign out option available in profile

## Features

### AuthContext
- **Location**: `src/contexts/AuthContext.tsx`
- **Features**:
  - User state management
  - Sign in/sign up functionality
  - Session persistence via localStorage
  - Automatic guest mode when auth is disabled

### Auth Component
- **Location**: `src/components/Auth.tsx`
- **Features**:
  - Clean, accessible login/signup forms
  - Password visibility toggle
  - Form validation
  - Demo credentials display
  - Guest mode option
  - Responsive design matching app theme

### Integration Points
- **App.tsx**: Main app logic, shows auth screen when needed
- **LopProfile.tsx**: Shows user info and sign out when authenticated

## Demo Credentials

When authentication is enabled, you can test with:
- **Email**: demo@solilop.com
- **Password**: demo123

## Customization

To customize authentication:

1. **Change demo credentials**: Edit `AUTH_CONFIG.demo` in `src/config/auth.ts`
2. **Modify guest user**: Edit `AUTH_CONFIG.guest` in `src/config/auth.ts`
3. **Add real backend**: Replace mock functions in `AuthContext.tsx` with real API calls
4. **Styling**: Modify `src/components/Auth.tsx` for custom auth UI

## Technical Details

- **Storage**: User sessions stored in `localStorage`
- **State Management**: React Context for auth state
- **Theme Support**: Auth screens support light/dark themes
- **Type Safety**: Full TypeScript support
- **Framework**: Built with React, Tailwind CSS, and Lucide icons

## Security Notes

This is a client-side demo authentication system suitable for development and testing. For production use:

1. Replace localStorage with secure session management
2. Add proper password hashing
3. Implement server-side authentication
4. Add security headers and CSRF protection
5. Use secure cookies for session tokens