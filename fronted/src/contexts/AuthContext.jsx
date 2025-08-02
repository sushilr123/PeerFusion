import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Prevent multiple authentication checks
      if (authChecked) {
        return;
      }

      try {
        console.log("[AUTH] Checking authentication...");
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          console.log("[AUTH] User authenticated:", userData);
          setUser(userData);
        }
      } catch (error) {
        if (isMounted) {
          console.log("[AUTH] No authenticated user:", error.message);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [authChecked]); // Only depend on authChecked

  const login = async (credentials) => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      setUser(userData);
      setAuthChecked(true);
      setLoading(false);
      return { success: true, data: userData };
    } catch (error) {
      console.error("[AUTH] Login error:", error);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const newUser = await authService.signup(userData);
      setUser(newUser);
      setAuthChecked(true);
      setLoading(false);
      return { success: true, data: newUser };
    } catch (error) {
      console.error("[AUTH] Signup error:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setAuthChecked(false); // Reset auth check flag for next login
      setLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null); // Force logout even if API call fails
      setAuthChecked(false); // Reset auth check flag
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("[AUTH] Refresh user error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
