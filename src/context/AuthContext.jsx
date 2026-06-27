import { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((employeeId, password, role) => {
    // TODO: Replace with real API call to /api/auth/login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find matching user by role for demo purposes
        const foundUser = mockUsers.find((u) => u.role === role) || mockUsers[0];
        if (foundUser) {
          const sessionUser = {
            ...foundUser,
            role: role,
          };
          setUser(sessionUser);
          localStorage.setItem('hrrl_user', JSON.stringify(sessionUser));
          resolve(sessionUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hrrl_user');
  }, []);

  // Restore session from localStorage
  useState(() => {
    const stored = localStorage.getItem('hrrl_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('hrrl_user');
      }
    }
  });

  const hasRole = useCallback(
    (requiredRoles) => {
      if (!user) return false;
      if (!requiredRoles || requiredRoles.length === 0) return true;
      return requiredRoles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
