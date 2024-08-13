import React from "react";
import { Typography, Button, Box, Container, Paper, Grid } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SecurityIcon from "@mui/icons-material/Security";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(20px)",
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius * 5,
  textTransform: "none",
  fontSize: "1.1rem",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: "50%",
  padding: theme.spacing(2),
  display: "inline-flex",
  marginBottom: theme.spacing(2),
}));

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="lg">
        <StyledPaper elevation={3}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <HomeIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    color: "primary.main",
                    letterSpacing: "-0.5px",
                  }}
                >
                  PropertyPro
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 4, color: "text.secondary", fontWeight: 300 }}
                >
                  Revolutionizing Property Management
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Link href="/authentification/login" passHref>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      startIcon={<LoginIcon />}
                      size="large"
                    >
                      Login
                    </StyledButton>
                  </Link>
                  <Link href="/authentification/signup" passHref>
                    <StyledButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<PersonAddIcon />}
                      size="large"
                    >
                      Sign Up
                    </StyledButton>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <ApartmentIcon />,
                      title: "Property Listings",
                      description:
                        "Easily manage all your properties in one place",
                    },
                    {
                      icon: <MonetizationOnIcon />,
                      title: "Financial Tracking",
                      description: "Keep track of rent payments and expenses",
                    },
                    {
                      icon: <SecurityIcon />,
                      title: "Secure Platform",
                      description: "Top-notch security for your sensitive data",
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Home;
