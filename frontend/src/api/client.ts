// API Client for backend communication

const API_BASE_URL = '/api';


interface User {
  id: string;
  email: string;
  lop_character: string;
  created_at: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Thought {
  id: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  created_at: number;
}

interface ThoughtsResponse {
  thoughts: Thought[];
  total: number;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth-token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth-token', token);
      } else {
        localStorage.removeItem('auth-token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Fallback if response isn't JSON
      }
      throw new ApiError(response.status, errorMessage);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, lopCharacter: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        lop_character: lopCharacter
      }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  // Thoughts endpoints
  async createThought(content: string): Promise<Thought> {
    return this.request<Thought>('/thoughts', {
      method: 'POST',
      body: JSON.stringify({
        content,
      }),
    });
  }

  async getThoughts(limit = 20, offset = 0): Promise<ThoughtsResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    return this.request<ThoughtsResponse>(`/thoughts?${params}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    return this.request<{ status: string; timestamp: number }>('/health');
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export types for use in components
export type { User, AuthResponse, Thought, ThoughtsResponse };
export { ApiError };