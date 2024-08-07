import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
    Snackbar,
    Container,
    Typography,
    Grid
} from '@mui/material';

export default function Home() {
    const [properties, setProperties] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [tenantTypes, setTenantTypes] = useState([]);
    const [newProperty, setNewProperty] = useState({
        propertyNumber: '',
        propertyType: '',
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [newTenant, setNewTenant] = useState({
        tenantType: '',
        name: '',
        email: '',
        phoneNumber: ''
    });
    const [editProperty, setEditProperty] = useState({});
    const [editTenant, setEditTenant] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProperties();
        fetchTenants();
        fetchPropertyTypes();
        fetchTenantTypes();
    }, []);

    const fetchProperties = () => {
        setLoading(true);
        axios.get('http://localhost:3001/properties')
            .then((response) => setProperties(response.data))
            .catch((error) => setError('Error fetching properties'))
            .finally(() => setLoading(false));
    };

    const fetchTenants = () => {
        setLoading(true);
        axios.get('http://localhost:3001/tenants')
            .then((response) => setTenants(response.data))
            .catch((error) => setError('Error fetching tenants'))
            .finally(() => setLoading(false));
    };

    const fetchPropertyTypes = () => {
        setLoading(true);
        axios.get('http://localhost:3001/property-types')
            .then((response) => setPropertyTypes(response.data))
            .catch((error) => setError('Error fetching property types'))
            .finally(() => setLoading(false));
    };

    const fetchTenantTypes = () => {
        setLoading(true);
        axios.get('http://localhost:3001/tenant-types')
            .then((response) => setTenantTypes(response.data))
            .catch((error) => setError('Error fetching tenant types'))
            .finally(() => setLoading(false));
    };

    const handleAddProperty = () => {
        axios.post('http://localhost:3001/properties', newProperty)
            .then(() => {
                setNewProperty({
                    propertyNumber: '',
                    propertyType: '',
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: ''
                });
                fetchProperties();
            })
            .catch((error) => setError('Error adding property'));
    };

    const handleAddTenant = () => {
        axios.post('http://localhost:3001/tenants', newTenant)
            .then(() => {
                setNewTenant({
                    tenantType: '',
                    name: '',
                    email: '',
                    phoneNumber: ''
                });
                fetchTenants();
            })
            .catch((error) => setError('Error adding tenant'));
    };

    const handleUpdateProperty = (id) => {
        axios.put(`http://localhost:3001/properties/${id}`, editProperty)
            .then(() => {
                setEditProperty({});
                fetchProperties();
            })
            .catch((error) => setError('Error updating property'));
    };

    const handleUpdateTenant = (id) => {
        axios.put(`http://localhost:3001/tenants/${id}`, editTenant)
            .then(() => {
                setEditTenant({});
                fetchTenants();
            })
            .catch((error) => setError('Error updating tenant'));
    };

    const handleDeleteProperty = (id) => {
        axios.delete(`http://localhost:3001/properties/${id}`)
            .then(() => fetchProperties())
            .catch((error) => setError('Error deleting property'));
    };

    const handleDeleteTenant = (id) => {
        axios.delete(`http://localhost:3001/tenants/${id}`)
            .then(() => fetchTenants())
            .catch((error) => setError('Error deleting tenant'));
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                My Next.js App
            </Typography>

            {loading && <CircularProgress />}
            {error && <Snackbar open={true} message={error} />}

            <Typography variant="h5" component="h2" gutterBottom>
                Properties
            </Typography>
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        {property.name}: {property.address}
                        <Button variant="contained" color="error" onClick={() => handleDeleteProperty(property.id)}>Delete</Button>
                        <Button variant="contained" color="primary" onClick={() => setEditProperty(property)}>Edit</Button>
                    </li>
                ))}
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Add Property
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Property Number"
                        value={newProperty.propertyNumber}
                        onChange={(e) => setNewProperty({ ...newProperty, propertyNumber: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Select
                        fullWidth
                        value={newProperty.propertyType}
                        onChange={(e) => setNewProperty({ ...newProperty, propertyType: e.target.value })}
                    >
                        <MenuItem value="">Select Property Type</MenuItem>
                        {propertyTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={newProperty.name}
                        onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        value={newProperty.address}
                        onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="City"
                        value={newProperty.city}
                        onChange={(e) => setNewProperty({ ...newProperty, city: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="State"
                        value={newProperty.state}
                        onChange={(e) => setNewProperty({ ...newProperty, state: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Zip Code"
                        value={newProperty.zipCode}
                        onChange={(e) => setNewProperty({ ...newProperty, zipCode: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddProperty}>Add</Button>
                </Grid>
            </Grid>

            <Typography variant="h6" component="h3" gutterBottom>
                Edit Property
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Property Number"
                        value={editProperty.propertyNumber || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, propertyNumber: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Select
                        fullWidth
                        value={editProperty.propertyType || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, propertyType: e.target.value })}
                    >
                        <MenuItem value="">Select Property Type</MenuItem>
                        {propertyTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={editProperty.name || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        value={editProperty.address || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, address: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="City"
                        value={editProperty.city || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, city: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="State"
                        value={editProperty.state || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, state: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Zip Code"
                        value={editProperty.zipCode || ''}
                        onChange={(e) => setEditProperty({ ...editProperty, zipCode: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => handleUpdateProperty(editProperty.id)}>Update</Button>
                </Grid>
            </Grid>

            <Typography variant="h5" component="h2" gutterBottom>
                Tenants
            </Typography>
            <ul>
                {tenants.map((tenant) => (
                    <li key={tenant.id}>
                        {tenant.name}: {tenant.email}
                        <Button variant="contained" color="error" onClick={() => handleDeleteTenant(tenant.id)}>Delete</Button>
                        <Button variant="contained" color="primary" onClick={() => setEditTenant(tenant)}>Edit</Button>
                    </li>
                ))}
            </ul>

            <Typography variant="h6" component="h3" gutterBottom>
                Add Tenant
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Select
                        fullWidth
                        value={newTenant.tenantType || ''}
                        onChange={(e) => setNewTenant({ ...newTenant, tenantType: e.target.value })}
                    >
                        <MenuItem value="">Select Tenant Type</MenuItem>
                        {tenantTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={newTenant.name || ''}
                        onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={newTenant.email || ''}
                        onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        value={newTenant.phoneNumber || ''}
                        onChange={(e) => setNewTenant({ ...newTenant, phoneNumber: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddTenant}>Add</Button>
                </Grid>
            </Grid>

            <Typography variant="h6" component="h3" gutterBottom>
                Edit Tenant
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Select
                        fullWidth
                        value={editTenant.tenantType || ''}
                        onChange={(e) => setEditTenant({ ...editTenant, tenantType: e.target.value })}
                    >
                        <MenuItem value="">Select Tenant Type</MenuItem>
                        {tenantTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={editTenant.name || ''}
                        onChange={(e) => setEditTenant({ ...editTenant, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={editTenant.email || ''}
                        onChange={(e) => setEditTenant({ ...editTenant, email: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        value={editTenant.phoneNumber || ''}
                        onChange={(e) => setEditTenant({ ...editTenant, phoneNumber: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => handleUpdateTenant(editTenant.id)}>Update</Button>
                </Grid>
            </Grid>
        </Container>
    );
}
