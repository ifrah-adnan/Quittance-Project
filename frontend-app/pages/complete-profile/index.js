import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
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
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
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
  const [userType, setUserType] = useState("PERSON");
  const [initialValues, setInitialValues] = useState({
    cin: "",
    address: "",
    phoneNumber: "",
    ice: "",
    companyName: "",
    contactName: "",
    signature: null,
    logo: null,
    userType: "PERSON",
  });
  const [signatureImage, setSignatureImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setInitialValues({
        cin: user.cin || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        ice: user.ice || "",
        companyName: user.companyName || "",
        contactName: user.contactName || "",
        signature: user.signature || null,
        logo: user.logo || null,
        userType: user.userType || "PERSON",
      });
      setSignaturePreview(
        user.signature ? `http://localhost:3001/${user.signature}` : null
      );
      setLogoPreview(user.logo ? `http://localhost:3001/${user.logo}` : null);
    }
  }, [user]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      for (const key in values) {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      }
      if (signatureImage) {
        formData.append("signature", signatureImage);
      } else if (!formik.values.signature) {
        formData.append("signature", formik.values.signature);
      }
      if (logoImage) {
        formData.append("logo", logoImage);
      } else if (!formik.values.logo) {
        formData.append("logo", formik.values.logo);
      }

      try {
        await axios.put("http://localhost:3001/complete-profile", formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        let errorMessage = "An unexpected error occurred";
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${
            error.response.data.error || error.response.statusText
          }`;
        } else if (error.request) {
          errorMessage = "No response received from the server";
        } else {
          errorMessage = error.message;
        }
        alert(`Error updating profile: ${errorMessage}`);
      }
    },
  });

  const handleUserTypeChange = (event, newUserType) => {
    if (newUserType !== null) {
      formik.setFieldValue("userType", newUserType.toUpperCase());
      setUserType(newUserType.toUpperCase());
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    setSignatureImage(file);
    setSignaturePreview(URL.createObjectURL(file));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogoImage(file);
    setLogoPreview(URL.createObjectURL(file));
  };

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

            <ToggleButtonGroup
              value={formik.values.userType}
              exclusive
              onChange={handleUserTypeChange}
              aria-label="user type"
              sx={{ mb: 4 }}
            >
              <ToggleButton value="PERSON" aria-label="person">
                Person
              </ToggleButton>
              <ToggleButton value="ENTERPRISE" aria-label="enterprise">
                Enterprise
              </ToggleButton>
            </ToggleButtonGroup>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: "1.25rem" }}
                >
                  User Information
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Fill in the details below to complete your profile.
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    label="CIN"
                    name="cin"
                    value={formik.values.cin}
                    onChange={formik.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  {formik.values.userType === "ENTERPRISE" && (
                    <>
                      <TextField
                        label="ICE"
                        name="ice"
                        value={formik.values.ice}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Company Name"
                        name="companyName"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Contact Name"
                        name="contactName"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <Box sx={{ mt: 2 }}>
                        <input
                          accept="image/*"
                          id="logo-file"
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleLogoChange}
                        />
                        <label htmlFor="logo-file">
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                          >
                            Upload Logo
                          </Button>
                        </label>
                        {logoPreview && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">
                              Logo Preview:
                            </Typography>
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              style={{
                                width: "100px",
                                height: "auto",
                                marginTop: "10px",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <input
                      accept="image/*"
                      id="signature-file"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleSignatureChange}
                    />
                    <label htmlFor="signature-file">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Signature
                      </Button>
                    </label>
                    {signaturePreview && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                          Signature Preview:
                        </Typography>
                        <img
                          src={signaturePreview}
                          alt="Signature Preview"
                          style={{
                            width: "100px",
                            height: "auto",
                            marginTop: "10px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                  >
                    Submit
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CompleteProfile;
