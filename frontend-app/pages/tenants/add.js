import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
  Autocomplete,
} from "@mui/material";

const AddTenant = () => {
  const router = useRouter();

  const [tenant, setTenant] = useState({
    tenantType: "",
    name: "",
    ice: "",
    address: "",
    contactName: "",
    contactCin: "",
    contactInfo: "",
    email: "", // Ajout du champ email
  });
  const [tenantTypes, setTenantTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTenantTypes();
  }, []);

  const fetchTenantTypes = () => {
    setLoading(true);
    // Définir les types de tenant directement dans le frontend
    setTenantTypes(["ENTERPRISE", "PERSON"]);
    setLoading(false);
  };

  const handleAddTenant = () => {
    axios
      .post("http://localhost:3001/tenants", tenant)
      .then(() => {
        console.log("Tenant added successfully");
        router.push("/tenants");
      })
      .catch((error) => {
        console.error(
          "Error adding tenant:",
          error.response ? error.response.data : error.message
        );
        setError("Error adding tenant");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push("/tenants");
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Add Tenant
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={tenantTypes}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Tenant Type" fullWidth />
            )}
            value={tenant.tenantType}
            onChange={(event, newValue) => {
              setTenant((prev) => ({ ...prev, tenantType: newValue }));
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={tenant.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ICE"
            name="ice"
            value={tenant.ice}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={tenant.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Name"
            name="contactName"
            value={tenant.contactName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact CIN"
            name="contactCin"
            value={tenant.contactCin}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Info"
            name="contactInfo"
            value={tenant.contactInfo}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email" // Ajout du champ email
            value={tenant.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={handleAddTenant}>
            Add Tenant
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddTenant;
