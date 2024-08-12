import React from "react";
import { Typography, Button, Box, Container, Paper } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontSize: "1rem",
}));

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      }}
    >
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <Box sx={{ textAlign: "center" }}>
            <HomeIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Welcome to Property Management
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
              Manage your properties with ease and efficiency
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Link href="/authentification/login" passHref>
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<LoginIcon />}
                >
                  Login
                </StyledButton>
              </Link>
              <Link href="/authentification/signup" passHref>
                <StyledButton
                  variant="outlined"
                  color="secondary"
                  startIcon={<PersonAddIcon />}
                >
                  Sign Up
                </StyledButton>
              </Link>
            </Box>
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Home;
