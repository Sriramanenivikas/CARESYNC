import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state and refresh user data from backend
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (savedUser && token) {
        setUser(savedUser);
        setIsAuthenticated(true);
        
        // Refresh user data from backend to get latest patientId/doctorId
        try {
          const response = await api.get('/auth/me');
          if (response.data?.success && response.data?.data) {
            const freshUser = response.data.data;
            // Update localStorage and state with fresh data
            localStorage.setItem('user', JSON.stringify(freshUser));
            setUser(freshUser);
          }
        } catch (e) {
          console.log('Could not refresh user data:', e.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  }, [user]);

  // Check if user has permission for a resource
  const hasPermission = useCallback((resource, action) => {
    if (!user) return false;
    
    const rolePermissions = {
      ADMIN: ['*'], // Admin has all permissions
      DOCTOR: ['patients:read', 'appointments:*', 'prescriptions:*', 'bills:read'],
      NURSE: ['patients:read', 'appointments:read', 'appointments:update', 'prescriptions:read'],
      RECEPTIONIST: ['patients:*', 'appointments:*', 'bills:*'],
      PATIENT: ['appointments:read', 'prescriptions:read', 'bills:read'],
    };

    const permissions = rolePermissions[user.role] || [];
    
    // Check for wildcard permissions
    if (permissions.includes('*')) return true;
    if (permissions.includes(`${resource}:*`)) return true;
    
    return permissions.includes(`${resource}:${action}`);
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
