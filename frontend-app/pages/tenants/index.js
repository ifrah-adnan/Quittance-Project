import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  CircularProgress,
  Snackbar,
  Grid
} from '@mui/material';
import CardComponent from '../../components/CardComponent';

const Tenants = ({ searchQuery }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = () => {
    setLoading(true);
    axios.get('http://localhost:3001/tenants')
      .then((response) => setTenants(response.data))
      .catch((error) => setError('Error fetching tenants'))
      .finally(() => setLoading(false));
  };

  const handleDeleteTenant = (id) => {
    axios.delete(`http://localhost:3001/tenants/${id}`)
      .then(() => fetchTenants())
      .catch((error) => setError('Error deleting tenant'));
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Tenants
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        {filteredTenants.map((tenant) => (
          <Grid item xs={12} sm={6} md={4} key={tenant.id}>
            <CardComponent
              item={tenant}
              onDelete={handleDeleteTenant}
              onEdit={() => { }}
              fields={['tenantType', 'name', 'ice', 'address', 'contactName', 'contactCin', 'contactInfo']}
              editLink="/tenants/edit"
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Tenants;
