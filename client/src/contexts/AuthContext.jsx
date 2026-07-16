import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService.js";

// undefined default (not null) lets useAuth() detect "used outside a
// provider" as a real error, rather than silently returning nothing.
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  // isLoading = "we're still figuring out if there's a valid existing
  // session" — used to avoid flashing the login page before we've even
  // checked localStorage.
  const [isLoading, setIsLoading] = useState(true);

  // On app load: if a token is already saved from a previous visit,
  // ask the backend "who am I?" (GET /auth/me) to restore the session
  // instead of forcing the user to log in again every time they refresh.
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiService.get("/auth/me");
        setUser(res.data.data.user);
        setTenant(res.data.data.tenant);
      } catch (error) {
        // Token was invalid/expired — clean up so we don't keep trying.
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await apiService.post("/auth/login", { email, password });
    const { token: newToken, data } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(data.user);
    setTenant(data.tenant);

    return data;
  };

  // `payload` matches what the backend expects:
  // { name, email, password, mode: "create"|"join", tenantName?, tenantSlug }
  const register = async (payload) => {
    const res = await apiService.post("/auth/register", payload);
    const { token: newToken, data } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(data.user);
    setTenant(data.tenant);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  const value = {
    user,
    tenant,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook so components write `const { user, login } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};