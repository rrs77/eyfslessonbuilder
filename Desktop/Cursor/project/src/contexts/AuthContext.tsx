import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wordpressAPI } from '../config/api';
import { ServiceLocator } from '../services';
import { IAuthContext, User, UserRole } from '../types';
import { ErrorHandler, PermissionService } from '../utils';
import { ADMIN_EMAIL } from '../constants';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Local user database - you can add more users here
const localUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'rob.reichstorer@gmail.com',
    password: 'mubqaZ-piske5-xecdur',
    name: 'Rob Reichstorer',
    avatar: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    role: 'administrator' as UserRole
  },
  // Add more users here as needed
  // {
  //   id: '2',
  //   email: 'teacher@rhythmstix.co.uk',
  //   password: 'teacher123',
  //   name: 'Sarah Teacher',
  //   avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  //   role: 'teacher'
  // }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get services
  const authService = ServiceLocator.getAuthService();
  const permissionService = ServiceLocator.getPermissionService();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'AuthContext.checkAuthStatus');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Use the auth service for authentication
      const authenticatedUser = await authService.login(username, password);
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'AuthContext.login');
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      ErrorHandler.logError(ErrorHandler.handleApiError(error), 'AuthContext.logout');
      // Still clear local state even if service logout fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Permission utilities
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return user ? PermissionService.isAdmin(user) : false;
  };

  const value: IAuthContext = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

// Hook to use auth context
export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}