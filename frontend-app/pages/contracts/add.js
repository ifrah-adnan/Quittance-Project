import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useRouter } from "next/router";

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
      .post("http://localhost:3001/contracts", form)
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
      })
      .catch(() => setError("Error creating contract"));
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
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={tenants}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Select Tenant" />
            )}
            value={form.tenant}
            onChange={(event, newValue) =>
              setForm((prev) => ({ ...prev, tenant: newValue }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            options={properties}
            getOptionLabel={(option) => option.address}
            renderInput={(params) => (
              <TextField {...params} label="Select Property" />
            )}
            value={form.property}
            onChange={(event, newValue) =>
              setForm((prev) => ({ ...prev, property: newValue }))
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
            type="number"
            value={form.rent}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rent: e.target.value }))
            }
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
        <Grid item xs={12}>
          {contracts.map((contract) => (
            <Card key={contract.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">
                  {contract.property.address}
                </Typography>
                <Typography>Tenant: {contract.tenant.name}</Typography>
                <Typography>Start Date: {contract.startDate}</Typography>
                <Typography>End Date: {contract.endDate}</Typography>
                <Typography>Rent: {contract.rent}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleSelectContract(contract)}
                >
                  View Details
                </Button>
                {/* Add more actions like Edit or Delete */}
              </CardActions>
            </Card>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Contracts;
