import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Snackbar } from "@mui/material";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken");
    router.push("/");
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setAuthError("Votre session a expiré. Veuillez vous reconnecter.");
          logout(); // Ceci va maintenant rediriger vers "/"
        }
        return Promise.reject(error);
      }
    );

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      axios
        .get("http://localhost:3001/user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout(); // En cas d'erreur lors de la vérification du token, déconnectez et redirigez
        });
    }

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
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
      setAuthError("");
    } catch (error) {
      console.error("Login failed", error);
      setIsAuthenticated(false);
      setUser(null);
      setAuthError(
        "Échec de la connexion. Veuillez vérifier vos informations."
      );
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
      {authError && (
        <Snackbar
          open={!!authError}
          autoHideDuration={6000}
          onClose={() => setAuthError("")}
          message={authError}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
