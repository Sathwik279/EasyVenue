import { createContext, useContext, useState, useEffect } from "react";

const AUTH_KEY = "easyvenue_auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { user: u, token: t } = JSON.parse(stored);
        if (u && t) {
          setUser(u);
          setToken(t);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const onLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const persist = (u, t) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ user: u, token: t }));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  };

  const login = (authData) => {
    const u = {
      userId: authData.userId,
      email: authData.email,
      role: authData.role,
      username: authData.username,
    };
    persist(u, authData.token);
    return u;
  };

  const logout = () => {
    persist(null, null);
  };

  const register = (authData) => {
    return login(authData);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
    register,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (...roles) => roles.includes(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
