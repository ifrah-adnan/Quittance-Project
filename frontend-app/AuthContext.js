import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Ajouter l'état pour les informations utilisateur

  useEffect(() => {
    // Récupérer les informations utilisateur depuis le localStorage lors du chargement
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      axios
        .get("http://localhost:3001/api/user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
