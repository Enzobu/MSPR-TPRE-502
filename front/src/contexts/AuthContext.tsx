import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  authHeader: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier si le token est expiré
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convertir en millisecondes
        
        if (Date.now() >= expirationTime) {
          // Token expiré
          handleLogout();
        } else {
          // Token valide
          setAuthHeader(`Bearer ${token}`);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // En cas d'erreur de décodage, on considère le token comme invalide
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setAuthHeader(`Bearer ${token}`);
    setIsAuthenticated(true);
  };

  const logout = handleLogout;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, authHeader }}>
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