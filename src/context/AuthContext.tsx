// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../data/types'; //
import api from '../services/api'; //

// Define Actions for state changes
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload?: string } // Payload holds the error message
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SIGNUP_FAILURE'; payload?: string } // Payload holds the error message
  | { type: 'UPDATE_PROFILE_START' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'UPDATE_PROFILE_FAILURE'; payload?: string } // Payload holds the error message
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }; // Action to clear error manually if needed

// Define context shape, including error state
interface AuthContextType extends Omit<AuthState, 'user'> {
  user: User | null;
  token: string | null;
  error?: string; // Expose error state
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Returns success status and potential error
  signup: (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'isActive'> & { password: string }) => Promise<{ success: boolean; error?: string }>; // Returns success status and potential error
  logout: () => void;
  updateProfile: (userData: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>) => Promise<{ success: boolean; error?: string }>; // Returns success status and potential error
  clearAuthError: () => void; // Function to clear error state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function to handle state updates
// Include 'error' in the state shape managed by the reducer
const authReducer = (state: AuthState & { token: string | null; error?: string }, action: AuthAction): AuthState & { token: string | null; error?: string } => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SIGNUP_START':
    case 'UPDATE_PROFILE_START':
      // Set loading true and clear any previous error
      return { ...state, isLoading: true, error: undefined };

    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      // Store token and user profile in localStorage for persistence
      localStorage.setItem('crackers_user_token', action.payload.token);
      localStorage.setItem('crackers_user_profile', JSON.stringify(action.payload.user));
      // Update state with user, token, set authenticated, clear loading/error
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
       // Clear storage only on login/signup failure, not profile update failure
       if (action.type !== 'UPDATE_PROFILE_FAILURE') {
            localStorage.removeItem('crackers_user_token');
            localStorage.removeItem('crackers_user_profile');
        }
      // Update state: clear loading, set error message
      return {
        ...state,
        // Keep user null only if it was a login/signup failure
        user: action.type !== 'UPDATE_PROFILE_FAILURE' ? null : state.user,
        token: action.type !== 'UPDATE_PROFILE_FAILURE' ? null : state.token,
        isAuthenticated: action.type !== 'UPDATE_PROFILE_FAILURE' ? false : state.isAuthenticated,
        isLoading: false,
        error: action.payload || 'An error occurred', // Store the error message
      };

    case 'LOGOUT':
      // Clear storage
      localStorage.removeItem('crackers_user_token');
      localStorage.removeItem('crackers_user_profile');
      // Reset state to initial unauthenticated values
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: undefined,
      };

    case 'UPDATE_PROFILE_SUCCESS':
      // Update profile in localStorage
      localStorage.setItem('crackers_user_profile', JSON.stringify(action.payload));
      // Update state with new user data, clear loading/error
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: undefined,
      };

    case 'SET_LOADING':
      // Set loading state, clear error
      return { ...state, isLoading: action.payload, error: undefined };

    case 'CLEAR_ERROR':
        // Clear only the error state
        return { ...state, error: undefined };

    default:
      return state;
  }
};

// Initial state, including token and error
const initialState: AuthState & { token: string | null; error?: string } = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start loading true to check localStorage on initial load
  error: undefined,
};

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check localStorage on initial load to maintain session
  useEffect(() => {
    let user: User | null = null;
    let token: string | null = null;
    try {
      token = localStorage.getItem('crackers_user_token');
      const userProfileString = localStorage.getItem('crackers_user_profile');
      if (userProfileString) {
        user = JSON.parse(userProfileString);
      }
    } catch (e) {
        console.error("Error reading auth data from localStorage:", e);
        // Clear potentially corrupted data if parsing fails
        localStorage.removeItem('crackers_user_token');
        localStorage.removeItem('crackers_user_profile');
    }

    if (token && user) {
      // If valid token and user found, dispatch success to restore state
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } else {
      // Otherwise, finish initial loading
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // LOGIN Function - Calls API and returns success/error
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.post('/auth/login', { email, password }); // POST /api/auth/login
      // Map _id from backend to id for frontend consistency
      const user: User = { ...response.data, id: response.data._id || response.data.id }; //
      const token: string = response.data.token;

      if (user && token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        return { success: true }; // Indicate success
      } else {
          // Should not happen if backend response is correct, but handles unexpected cases
          throw new Error("Login failed: Invalid response data from server");
      }
    } catch (error: any) {
      // Extract specific error message from backend response if available
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      console.error("Login API error:", error.response?.data || error);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage }; // Return failure and the error message
    }
  };

  // SIGNUP Function - Calls API and returns success/error
  const signup = async (userData: Omit<User, 'id' | 'role' | 'createdAt' | 'isActive'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'SIGNUP_START' });
    try {
      const response = await api.post('/auth/register', userData); // POST /api/auth/register
      const user: User = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      const token: string = response.data.token;

      if (user && token) {
        dispatch({ type: 'SIGNUP_SUCCESS', payload: { user, token } });
        return { success: true }; // Indicate success
      } else {
          throw new Error("Signup failed: Invalid response data from server");
       }
    } catch (error: any) {
      // Extract specific backend error message (like "Email address already in use")
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      console.error("Signup API error:", error.response?.data || error);
      dispatch({ type: 'SIGNUP_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage }; // Return failure and the error message
    }
  };

  // LOGOUT Function - Clears state and localStorage
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // UPDATE PROFILE Function - Calls API and returns success/error
  const updateProfile = async (userData: Partial<Omit<User, 'id' | 'role' | 'createdAt'>>): Promise<{ success: boolean; error?: string }> => {
    // Prevent update if not logged in
    if (!state.user) return { success: false, error: 'Not logged in' };

    dispatch({ type: 'UPDATE_PROFILE_START' });
    try {
      const response = await api.put('/users/profile', userData); // PUT /api/users/profile
      const updatedUser: User = { ...response.data, id: response.data._id || response.data.id }; // Map _id

      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      return { success: true }; // Indicate success
    } catch (error: any) {
       const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
       console.error("Update Profile API error:", error.response?.data || error);
       dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage }; // Return failure and the error message
    }
  };

   // Function to clear the error state manually
   const clearAuthError = () => {
       dispatch({ type: 'CLEAR_ERROR' });
   };


  // Provide state and functions via context
  const value: AuthContextType = {
      ...state,
      login,
      signup,
      logout,
      updateProfile,
      clearAuthError // Expose the clear error function
    };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume the context easily
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
      // Ensure the hook is used within an AuthProvider
      throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};