import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import { useAuth } from "../../AuthContext";

const EditContract = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [contract, setContract] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    tenant: "",
    property: "",
    startDate: "",
    endDate: "",
    rent: "",
    conditions: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchTenants();
      if (id) {
        fetchContract(id);
      }
    }
  }, [user, id]);

  const fetchContract = (contractId) => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/contracts/${contractId}`, {
        params: { userId: user.id },
      })
      .then((response) => {
        const data = response.data;
        setContract(data);
        setForm({
          tenant: data.tenantId,
          property: data.propertyId,
          startDate: data.startDate,
          endDate: data.endDate,
          rent: data.rentAmount,
          conditions: data.terms,
        });
      })
      .catch(() => setError("Error fetching contract"))
      .finally(() => setLoading(false));
  };

  const fetchTenants = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/tenants", {
        params: { userId: user.id },
      })
      .then((response) => setTenants(response.data))
      .catch(() => setError("Error fetching tenants"));
  };

  const fetchProperties = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/properties", {
        params: { userId: user.id },
      })
      .then((response) => setProperties(response.data))
      .catch(() => setError("Error fetching properties"))
      .finally(() => setLoading(false));
  };

  const handleUpdateContract = () => {
    axios
      .put(`http://localhost:3001/contracts/${id}`, {
        tenantId: form.tenant,
        propertyId: form.property,
        startDate: form.startDate,
        endDate: form.endDate,
        rentAmount: parseFloat(form.rent),
        terms: form.conditions,
        // userId: user.id,
      })
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error updating contract");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Contract
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {contract && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={tenants}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Select Tenant" />
              )}
              value={
                tenants.find((tenant) => tenant.id === form.tenant) || null
              }
              onChange={(event, newValue) =>
                setForm((prev) => ({ ...prev, tenant: newValue?.id || "" }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={properties}
              getOptionLabel={(option) => option.propertyNumber}
              renderInput={(params) => (
                <TextField {...params} label="Select Property" />
              )}
              value={
                properties.find((property) => property.id === form.property) ||
                null
              }
              onChange={(event, newValue) =>
                setForm((prev) => ({ ...prev, property: newValue?.id || "" }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.endDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rent"
              type="text"
              value={form.rent}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setForm((prev) => ({ ...prev, rent: value }));
                }
              }}
              placeholder="Enter rent amount"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Conditions"
              multiline
              rows={4}
              value={form.conditions}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, conditions: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateContract}
            >
              Update Contract
            </Button>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error || "Contract updated successfully"}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default EditContract;
