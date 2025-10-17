import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextDefinition";
import { authService } from "../services/api";

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

      // Skip auth check if we're on public pages
      const currentPath = window.location.pathname;
      if (
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/signup"
      ) {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
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
          // Don't redirect here, let the interceptor handle it
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
      console.log("[AUTH] Attempting login...");
      const userData = await authService.login(credentials);
      console.log("[AUTH] Login successful:", userData);
      setUser(userData);
      setAuthChecked(true);
      setLoading(false);
      return { success: true, data: userData };
    } catch (error) {
      console.error("[AUTH] Login error:", error);
      setLoading(false);
      // Extract meaningful error message
      const errorMessage =
        error.response?.data || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      console.log("[AUTH] Attempting signup...");
      const newUser = await authService.signup(userData);
      console.log("[AUTH] Signup successful:", newUser);
      setUser(newUser);
      setAuthChecked(true);
      setLoading(false);
      return { success: true, data: newUser };
    } catch (error) {
      console.error("[AUTH] Signup error:", error);
      setLoading(false);
      // Extract meaningful error message from backend
      let errorMessage = "Signup failed";
      if (error.response?.data) {
        // Backend sends "ERROR : message"
        errorMessage = error.response.data.replace("ERROR : ", "");
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
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
