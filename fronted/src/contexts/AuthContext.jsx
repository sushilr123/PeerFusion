import React, { createContext, useState, useEffect, useRef } from "react";
import { authService } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authCheckedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Prevent multiple authentication checks
      if (authCheckedRef.current) {
        return;
      }

      authCheckedRef.current = true;

      try {
        console.log("[AUTH] Checking authentication...");
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          console.log("[AUTH] User authenticated:", userData);
          setUser(userData); // API now returns user data directly
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.log("[AUTH] No authenticated user:", error.message);
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once on mount

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      console.error("[AUTH] Login error:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
      return { success: true, data: newUser };
    } catch (error) {
      console.error("[AUTH] Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      authCheckedRef.current = false; // Reset auth check flag for next login
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null); // Force logout even if API call fails
      authCheckedRef.current = false; // Reset auth check flag
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
