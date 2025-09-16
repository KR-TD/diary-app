"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface UserResponse {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserResponse | null;
  login: (atk: string, rtk: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await fetch('https://code.haru2end.dedyn.io/api/user/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Handle error, maybe logout
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user info", error);
      logout();
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch('https://code.haru2end.dedyn.io/api/user/is-logged-in', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok && await response.json()) {
            setIsLoggedIn(true);
            await fetchUser(); // Fetch user info after verifying token
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification failed", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (atk: string, rtk: string) => {
    localStorage.setItem('accessToken', atk);
    localStorage.setItem('refreshToken', rtk);
    setIsLoggedIn(true);
    await fetchUser(); // Fetch user info on login
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
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
