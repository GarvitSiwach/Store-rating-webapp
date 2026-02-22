import { createContext, useState, useEffect } from "react";
import { loginUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  // Persist login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
  
    if (token && role) {
      setUser({ role });
    }
  
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setUser({ role: data.role });

    return data.role;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};