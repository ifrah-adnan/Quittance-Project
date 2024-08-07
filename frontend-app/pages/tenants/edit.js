import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Grid,
  Typography
} from '@mui/material';

const EditTenant = () => {
  const router = useRouter();
  const { id } = router.query;

  const [tenant, setTenant] = useState({});
  const [tenantTypes, setTenantTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTenant();
      fetchTenantTypes();
    }
  }, [id]);

  const fetchTenant = () => {
    setLoading(true);
    axios.get(`http://localhost:3001/tenants/${id}`)
      .then((response) => setTenant(response.data))
      .catch((error) => setError('Error fetching tenant'))
      .finally(() => setLoading(false));
  };

  const fetchTenantTypes = () => {
    setLoading(true);
    axios.get('http://localhost:3001/tenant-types')
      .then((response) => setTenantTypes(response.data))
      .catch((error) => setError('Error fetching tenant types'))
      .finally(() => setLoading(false));
  };

  const handleUpdateTenant = () => {
    axios.put(`http://localhost:3001/tenants/${id}`, tenant)
      .then(() => router.push('/tenants'))
      .catch((error) => setError('Error updating tenant'));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Tenant
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Select
            fullWidth
            name="tenantType"
            value={tenant.tenantType || ''}
            onChange={handleChange}
          >
            <MenuItem value="">Select Tenant Type</MenuItem>
            {tenantTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={tenant.name || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ICE"
            name="ice"
            value={tenant.ice || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={tenant.address || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Name"
            name="contactName"
            value={tenant.contactName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact CIN"
            name="contactCin"
            value={tenant.contactCin || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Info"
            name="contactInfo"
            value={tenant.contactInfo || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdateTenant}>
            Update
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditTenant;
