// import React from "react";
// import { Typography, Button, Box, Container, Paper, Grid } from "@mui/material";
// import Link from "next/link";
// import { styled } from "@mui/material/styles";
// import HomeIcon from "@mui/icons-material/Home";
// import LoginIcon from "@mui/icons-material/Login";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
// import SecurityIcon from "@mui/icons-material/Security";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(6),
//   backgroundColor: "rgba(255, 255, 255, 0.9)",
//   backdropFilter: "blur(20px)",
//   borderRadius: theme.shape.borderRadius * 3,
//   boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//   border: "1px solid rgba(255, 255, 255, 0.18)",
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//   margin: theme.spacing(1),
//   padding: theme.spacing(1.5, 4),
//   fontWeight: "bold",
//   borderRadius: theme.shape.borderRadius * 5,
//   textTransform: "none",
//   fontSize: "1.1rem",
//   transition: "all 0.3s ease-in-out",
//   "&:hover": {
//     transform: "translateY(-3px)",
//     boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//   },
// }));

// const FeatureIcon = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   borderRadius: "50%",
//   padding: theme.spacing(2),
//   display: "inline-flex",
//   marginBottom: theme.spacing(2),
// }));

// const Home = () => {
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       <Container maxWidth="lg">
//         <StyledPaper elevation={3}>
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Box sx={{ textAlign: "center" }}>
//                 <HomeIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
//                 <Typography
//                   variant="h2"
//                   component="h1"
//                   gutterBottom
//                   sx={{
//                     fontWeight: 800,
//                     color: "primary.main",
//                     letterSpacing: "-0.5px",
//                   }}
//                 >
//                   PropertyPro
//                 </Typography>
//                 <Typography
//                   variant="h5"
//                   sx={{ mb: 4, color: "text.secondary", fontWeight: 300 }}
//                 >
//                   Revolutionizing Property Management
//                 </Typography>
//                 <Box sx={{ mt: 4 }}>
//                   <Link href="/authentification/login" passHref>
//                     <StyledButton
//                       variant="contained"
//                       color="primary"
//                       startIcon={<LoginIcon />}
//                       size="large"
//                     >
//                       Login
//                     </StyledButton>
//                   </Link>
//                   <Link href="/authentification/signup" passHref>
//                     <StyledButton
//                       variant="outlined"
//                       color="secondary"
//                       startIcon={<PersonAddIcon />}
//                       size="large"
//                     >
//                       Sign Up
//                     </StyledButton>
//                   </Link>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Box sx={{ textAlign: "center" }}>
//                 <Grid container spacing={3}>
//                   {[
//                     {
//                       icon: <ApartmentIcon />,
//                       title: "Property Listings",
//                       description:
//                         "Easily manage all your properties in one place",
//                     },
//                     {
//                       icon: <MonetizationOnIcon />,
//                       title: "Financial Tracking",
//                       description: "Keep track of rent payments and expenses",
//                     },
//                     {
//                       icon: <SecurityIcon />,
//                       title: "Secure Platform",
//                       description: "Top-notch security for your sensitive data",
//                     },
//                   ].map((feature, index) => (
//                     <Grid item xs={12} sm={4} key={index}>
//                       <FeatureIcon>{feature.icon}</FeatureIcon>
//                       <Typography
//                         variant="h6"
//                         gutterBottom
//                         sx={{ fontWeight: 600 }}
//                       >
//                         {feature.title}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {feature.description}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
//             </Grid>
//           </Grid>
//         </StyledPaper>
//       </Container>
//     </Box>
//   );
// };

// export default Home;

//======================================================================
//v2
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
  padding: theme.spacing(8),
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(30px)",
  borderRadius: theme.shape.borderRadius * 4,
  boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1.5),
  padding: theme.spacing(1.75, 5),
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 6,
  textTransform: "none",
  fontSize: "1.2rem",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.15)",
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  padding: theme.spacing(2.5),
  display: "inline-flex",
  marginBottom: theme.spacing(3),
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: theme.palette.primary.main,
  },
}));

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="lg">
        <StyledPaper elevation={5}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <HomeIcon
                  sx={{ fontSize: 100, color: "primary.main", mb: 3 }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    color: "primary.main",
                    letterSpacing: "-1px",
                    fontSize: { xs: "3rem", md: "4rem" },
                  }}
                >
                  PropertyPro
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 5,
                    color: "text.secondary",
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  Votre solution intelligente pour la gestion locative
                </Typography>
                <Box sx={{ mt: 5 }}>
                  <Link href="/authentification/login" passHref>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      startIcon={<LoginIcon />}
                      size="large"
                    >
                      Connexion
                    </StyledButton>
                  </Link>
                  <Link href="/authentification/signup" passHref>
                    <StyledButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<PersonAddIcon />}
                      size="large"
                    >
                      Inscription
                    </StyledButton>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <Grid container spacing={4}>
                  {[
                    {
                      icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
                      title: "Gestion de biens",
                      description:
                        "Centralisez et optimisez la gestion de tous vos biens immobiliers",
                    },
                    {
                      icon: <MonetizationOnIcon sx={{ fontSize: 40 }} />,
                      title: "Suivi financier",
                      description:
                        "Gérez efficacement vos revenus locatifs et vos dépenses",
                    },
                    {
                      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                      title: "Sécurité renforcée",
                      description:
                        "Protection avancée de vos données sensibles",
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
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
