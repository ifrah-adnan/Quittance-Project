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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Ajoutez un champ pour le nom
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer la requête d'inscription au backend
      const response = await axios.post("http://localhost:3001/api/signup", {
        email,
        password,
        name,
      });

      // Gérer la réponse en cas de succès
      if (response.status === 201) {
        setSuccess("Signup successful!");
        setTimeout(() => {
          router.push("/authentification/login"); // Redirection vers la page de connexion après l'inscription
        }, 2000);
      }
    } catch (err) {
      // Gérer les erreurs d'inscription
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Signup failed!");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Signup
        </Button>
      </form>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
        >
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Signup;
