import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuth } from "../../AuthContext"; // Assurez-vous que le chemin est correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // Utilisez le hook d'authentification

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });

      // Supposons que la réponse contienne un token
      const { token } = response.data;

      // Stocker le token dans le localStorage ou sessionStorage
      localStorage.setItem("authToken", token);

      // Mettez à jour le contexte d'authentification
      login(); // Met à jour le contexte si nécessaire

      setSuccess("Login successful!");
      router.push("/properties");
    } catch (err) {
      setError("Login failed! Please check your credentials.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Login;
