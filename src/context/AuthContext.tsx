import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../data/types'; //
import api from '../services/api'; //

// Define Actions for state changes
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload?: string }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SIGNUP_FAILURE'; payload?: string }
  | { type: 'UPDATE_PROFILE_START' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'UPDATE_PROFILE_FAILURE'; payload?: string }
  | { type: 'SET_LOADING'; payload: boolean };

// Define context shape
interface AuthContextType extends Omit<AuthState, 'user'> {
  user: User | null;
  token: string | null;
  error?: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'isActive'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState & { token: string | null; error?: string }, action: AuthAction): AuthState & { token: string | null; error?: string } => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SIGNUP_START':
    case 'UPDATE_PROFILE_START':
      return { ...state, isLoading: true, error: undefined };

    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      localStorage.setItem('crackers_user_token', action.payload.token); // Store token
      localStorage.setItem('crackers_user_profile', JSON.stringify(action.payload.user)); // Store user profile
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: undefined,
      };

    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
    case 'UPDATE_PROFILE_FAILURE':
       if (action.type !== 'UPDATE_PROFILE_FAILURE') {
            localStorage.removeItem('crackers_user_token');
            localStorage.removeItem('crackers_user_profile');
        }
      return {
        ...state,
        isLoading: false,
        error: action.payload || 'An error occurred',
      };

    case 'LOGOUT':
      localStorage.removeItem('crackers_user_token'); // Clear storage
      localStorage.removeItem('crackers_user_profile'); // Clear storage
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      };

    case 'UPDATE_PROFILE_SUCCESS':
      localStorage.setItem('crackers_user_profile', JSON.stringify(action.payload)); // Update profile in storage
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: undefined,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: undefined };

    default:
      return state;
  }
};

// Initial state
const initialState: AuthState & { token: string | null; error?: string } = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Check storage on load
  error: undefined,
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check localStorage on initial load
  useEffect(() => {
    let user: User | null = null;
    let token: string | null = null;
    try {
      token = localStorage.getItem('crackers_user_token');
      const userProfileString = localStorage.getItem('crackers_user_profile');
      if (userProfileString) {
        user = JSON.parse(userProfileString);
      }
    } catch (e) { console.error("Error reading auth data", e); /* Clear potentially corrupted data */ }

    if (token && user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // LOGIN Function - Calls API
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/login', { email, password }); // POST /api/auth/login
      const user: User = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      const token: string = response.data.token; // Get token

      if (user && token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return { success: true };
      } else { throw new Error("Login failed: Invalid response"); }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error("Login API error:", error.response?.data || error);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // SIGNUP Function - Calls API
  const signup = async (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'isActive'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SIGNUP_START' });
    try {
      const response = await api.post('/auth/register', userData); // POST /api/auth/register
      const user: User = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      const token: string = response.data.token; // Get token

      if (user && token) {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: { user, token } });
        return { success: true };
      } else { throw new Error("Signup failed: Invalid response"); }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      console.error("Signup API error:", error.response?.data || error);
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // LOGOUT Function
  const logout = () => {
    dispatch({ type: 'LOGOUT' }); // Clears state and localStorage
  };

  // UPDATE PROFILE Function - Calls API
  const updateProfile = async (userData: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>): Promise<{ success: boolean; error?: string }> => {
    if (!state.user) return { success: false, error: 'Not logged in' };
    dispatch({ type: 'UPDATE_PROFILE_START' });
    try {
      const response = await api.put('/users/profile', userData); // PUT /api/users/profile
      const updatedUser: User = { ...response.data, id: response.data._id || response.data.id }; // Map _id

      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      return { success: true };
    } catch (error: any) {
       const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
       console.error("Update Profile API error:", error.response?.data || error);
       dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Provide state and functions
  const value: AuthContextType = { ...state, login, signup, logout, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) { throw new Error('useAuth must be used within an AuthProvider'); }
  return context;
};