
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock JWT functions for frontend demonstration
const generateToken = (user: Omit<User, 'createdAt' | 'updatedAt'>) => {
  return `mock-jwt-token-${user.id}-${user.role}`;
};

const parseToken = (token: string | null) => {
  if (!token) return null;
  
  // In a real app, you would verify and decode the JWT
  // This is just for demonstration
  const parts = token.split('-');
  if (parts.length < 4) return null;
  
  return {
    id: parts[2],
    role: parts[3] as UserRole
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('auth_token');
    const userData = parseToken(token);
    
    if (userData) {
      // Mock user data based on token
      // In a real app, you would fetch user data from your API
      const mockUser: User = {
        id: userData.id,
        name: 'User ' + userData.id,
        email: `user${userData.id}@example.com`,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    // Mock login - in a real app, you would make an API call
    const mockUsers: Record<string, User> = {
      'admin@example.com': {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      'manager@example.com': {
        id: '2',
        name: 'Test Manager',
        email: 'manager@example.com',
        role: 'test_manager',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      'engineer@example.com': {
        id: '3',
        name: 'Test Engineer',
        email: 'engineer@example.com',
        role: 'test_engineer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers[email];
        
        if (foundUser && password === 'password') {
          // Generate a token and save it
          const token = generateToken({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role
          });
          
          localStorage.setItem('auth_token', token);
          setUser(foundUser);
          setIsAuthenticated(true);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };
  
  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in a real app, you would make an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if email is already taken
        if (email === 'admin@example.com' || email === 'manager@example.com' || email === 'engineer@example.com') {
          reject(new Error('Email already in use'));
          return;
        }
        
        // Create a new user
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role: 'test_engineer', // Default role for self-registration
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Generate a token and save it
        const token = generateToken({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
        
        localStorage.setItem('auth_token', token);
        setUser(newUser);
        setIsAuthenticated(true);
        resolve();
      }, 500);
    });
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (user.role === 'admin') {
      // Admin has access to everything
      return true;
    }
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
