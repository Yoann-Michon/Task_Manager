import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/User.service';
import type { User, UserContextType } from '../models/user.interface';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const profile = await userService.getProfile();
      const userData = profile && (profile as any).user ? (profile as any).user : profile;
      setUser(userData as User);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const resp = await userService.login({ email, password });
      const data = resp && (resp as any).user ? (resp as any).user : resp;
      setUser(data as User);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const resp = await userService.register({ name, email, password });
      const data = resp && (resp as any).user ? (resp as any).user : resp;
      setUser(data as User);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth/login');
    }
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      const userData = profile && (profile as any).user ? (profile as any).user : profile;
      setUser(userData as User);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};