// Authentication Configuration
// Set AUTH_ENABLED to true to enable authentication features
// Set AUTH_ENABLED to false to run in guest mode (no login required)

export const AUTH_CONFIG = {
  // Enable/disable authentication
  enabled: true,
  
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
} as const;

export default AUTH_CONFIG;