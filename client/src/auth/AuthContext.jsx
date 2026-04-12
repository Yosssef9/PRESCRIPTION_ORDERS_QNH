import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { getToken } from "../helpers/getToken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  async function bootstrapAuth() {
    try {
      const token = getToken();
      console.log("bootstrapAuth token", token);
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Auth bootstrap failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    window.location.href = "/login.html";
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      logout,
      refreshAuth: bootstrapAuth,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
