import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem("pass4sure_token"));
  const [loading, setLoading] = useState(true);

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("pass4sure_token", newToken);
    } else {
      localStorage.removeItem("pass4sure_token");
    }
    setTokenState(newToken);
  };

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      // ignore logout errors
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!token) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        if (isMounted) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
