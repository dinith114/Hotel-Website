import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  // On mount, verify stored token
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("adminToken");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setAdmin(res.data.data.admin);
        setToken(storedToken);
      } catch {
        localStorage.removeItem("adminToken");
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const { admin: adminData, token: newToken } = res.data.data;
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ admin, setAdmin, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
