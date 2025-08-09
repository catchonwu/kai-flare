import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import LopCharacter, { lopPersonalities, LopPersonality } from './LopCharacter';
import AUTH_CONFIG from '../config/auth';
import { Eye, EyeOff, Loader2, AlertCircle, Heart, Sparkles } from 'lucide-react';

interface AuthProps {
  onSkipAuth?: () => void;
  onAuthSuccess?: () => void;
  showAsPostOnboarding?: boolean;
  selectedLop?: LopPersonality | null;
}

export default function Auth({ onSkipAuth, onAuthSuccess, showAsPostOnboarding = false, selectedLop }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { signIn, signUp, isLoading, error, clearError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setValidationError('Please fill in all required fields');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setValidationError('Please enter your name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setValidationError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        // Pass the selected Lop character ID to signUp
        const lopCharacterId = selectedLop?.id || lopPersonalities[0].id;
        await signUp(formData.email, formData.password, formData.name, lopCharacterId);
      }
      // Call success callback if provided
      onAuthSuccess?.();
    } catch (err) {
      // Error is handled by the context
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    clearError();
    setValidationError('');
  };

  const displayError = error || validationError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/20 via-background to-peachy/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="p-4">
            <LopCharacter 
              personality={lopPersonalities[0]} 
              size="lg" 
              className="mx-auto"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="relative">
                <Heart className="w-8 h-8 text-coral" />
                <Sparkles className="w-4 h-4 text-mint absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-mint to-lavender bg-clip-text text-transparent">
                Solilop
              </h1>
            </div>
            <p className="text-muted-foreground">
              {showAsPostOnboarding
                ? (isLogin 
                    ? 'Sign in to save your Lop companion and thoughts'
                    : 'Create an account to keep your journey with your Lop safe'
                  )
                : (isLogin 
                    ? 'Welcome back to your sanctuary' 
                    : 'Create your gentle space'
                  )
              }
            </p>
          </div>
        </div>

        {/* Demo credentials info */}
        {isLogin && (
          <div className="p-3 bg-mint/10 rounded-lg text-center">
            <p className="text-sm text-mint">
              <strong>Demo:</strong> {AUTH_CONFIG.demo.email} / {AUTH_CONFIG.demo.password}
            </p>
          </div>
        )}

        {/* Auth Form */}
        <Card className="p-6 bg-white/80 dark:bg-card/80 border-mint/10 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field for signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="h-12 rounded-lg border-mint/20 focus:border-mint/50"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="h-12 rounded-lg border-mint/20 focus:border-mint/50"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="h-12 rounded-lg border-mint/20 focus:border-mint/50 pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm password field for signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="h-12 rounded-lg border-mint/20 focus:border-mint/50 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Error message */}
            {displayError && (
              <div className="flex items-center space-x-2 text-coral p-3 bg-coral/10 border border-coral/20 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-coral hover:bg-coral/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        </Card>

        {/* Switch between login/signup */}
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0 h-auto text-coral hover:text-coral/80"
              onClick={switchMode}
              disabled={isLoading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
          
          {onSkipAuth && (
            <div className="pt-4 border-t border-border/20">
              <p className="text-xs text-muted-foreground mb-2">
                {showAsPostOnboarding 
                  ? 'Want to continue exploring first?' 
                  : 'Just want to explore?'
                }
              </p>
              <Button
                variant="ghost"
                onClick={onSkipAuth}
                disabled={isLoading}
                className="text-lavender hover:text-lavender/80 hover:bg-lavender/10"
              >
                {showAsPostOnboarding ? 'Keep Exploring' : 'Continue as Guest'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}