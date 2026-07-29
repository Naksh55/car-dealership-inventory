import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import client from "../api/client";

const AuthContext = createContext(null);

function decodeUser(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    return { email: payload.sub, isAdmin: !!payload.is_admin };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => decodeUser(localStorage.getItem("token")));
  const [error, setError] = useState("");

  async function register(email, password) {
    setError("");
    try {
      await client.post("/api/auth/register", { email, password });
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      return false;
    }
  }

  async function login(email, password) {
    setError("");
    try {
      const res = await client.post("/api/auth/login", { email, password });
      const newToken = res.data.access_token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(decodeUser(newToken));
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
