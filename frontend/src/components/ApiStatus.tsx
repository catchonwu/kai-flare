import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApiStatusProps {
  className?: string;
}

type Status = 'checking' | 'online' | 'offline';

export default function ApiStatus({ className = '' }: ApiStatusProps) {
  const [status, setStatus] = useState<Status>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      await apiClient.healthCheck();
      setStatus('online');
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('offline');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="w-3 h-3 animate-spin text-muted-foreground" />;
      case 'online':
        return <CheckCircle className="w-3 h-3 text-mint" />;
      case 'offline':
        return <XCircle className="w-3 h-3 text-coral" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Connecting...';
      case 'online':
        return 'Connected';
      case 'offline':
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-muted-foreground';
      case 'online':
        return 'text-mint';
      case 'offline':
        return 'text-coral';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-xs ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {lastCheck && (
        <span className="text-xs text-muted-foreground">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
}