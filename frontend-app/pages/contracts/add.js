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
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/router";
import MuiAlert from "@mui/material/Alert"; // Assurez-vous d'avoir ce package installé

const Contracts = () => {
  const router = useRouter();

  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
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
    fetchContracts();
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/contracts")
      .then((response) => setContracts(response.data))
      .catch(() => setError("Error fetching contracts"))
      .finally(() => setLoading(false));
  };

  const fetchTenants = () => {
    axios
      .get("http://localhost:3001/tenants")
      .then((response) => setTenants(response.data))
      .catch(() => setError("Error fetching tenants"));
  };

  const fetchProperties = () => {
    axios
      .get("http://localhost:3001/properties")
      .then((response) => setProperties(response.data))
      .catch(() => setError("Error fetching properties"));
  };

  const handleCreateContract = () => {
    axios
      .post("http://localhost:3001/contracts", {
        tenantId: form.tenant,
        propertyId: form.property,
        startDate: form.startDate,
        endDate: form.endDate,
        rentAmount: parseFloat(form.rent), // Assurez-vous que `price` est un nombre
        terms: form.conditions,
      })
      .then(() => {
        fetchContracts();
        setForm({
          tenant: "",
          property: "",
          startDate: "",
          endDate: "",
          rent: "",
          conditions: "",
        });
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error creating contract");
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectContract = (contract) => {
    setSelectedContract(contract);
    // Optionally fetch detailed information or populate form for editing
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Contracts
      </Typography>
      {loading && <CircularProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={tenants}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Select Tenant" />
            )}
            value={tenants.find((tenant) => tenant.id === form.tenant) || null}
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
            type="text" // Changer le type à 'text'
            value={form.rent}
            onChange={(e) => {
              // Optionnel: ajouter une validation pour le format de prix
              const value = e.target.value;
              // Vous pouvez ajouter une validation plus complexe ici si nécessaire
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
            onClick={handleCreateContract}
          >
            Create Contract
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error || " Contract created successfully"}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Contracts;
