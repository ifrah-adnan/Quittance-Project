import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  CssBaseline,
  Divider,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Person as PersonIcon } from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const CompleteProfile = () => {
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState({
    cin: "",
    address: "",
    phoneNumber: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setInitialValues({
        cin: user.cin || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const validationSchema = Yup.object({
    cin: Yup.string().required("CIN is required"),
    address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.put("http://localhost:3001/complete-profile", values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile");
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "secondary.main", width: 72, height: 72 }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ fontSize: "2rem" }}
            >
              Complete Your Profile
            </Typography>
            <Divider sx={{ width: "100%", mb: 3 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: "1.25rem" }}
                >
                  User Information
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.125rem" }}
                >
                  Name: {user?.name}
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.125rem" }}
                >
                  Email: {user?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box component="form" onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    id="cin"
                    name="cin"
                    label="CIN"
                    value={formik.values.cin}
                    onChange={formik.handleChange}
                    error={formik.touched.cin && Boolean(formik.errors.cin)}
                    helperText={formik.touched.cin && formik.errors.cin}
                    margin="normal"
                    variant="outlined"
                    sx={{ fontSize: "1.125rem" }}
                  />
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{ fontSize: "1.125rem" }}
                  />
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.phoneNumber &&
                      Boolean(formik.errors.phoneNumber)
                    }
                    helperText={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                    margin="normal"
                    variant="outlined"
                    sx={{ fontSize: "1.125rem" }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 4, mb: 2, py: 1.5, fontSize: "1.125rem" }}
                  >
                    Save Profile
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CompleteProfile;
