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

const EditProperty = () => {
    const router = useRouter();
    const { id } = router.query;

    const [property, setProperty] = useState({});
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchProperty();
            fetchPropertyTypes();
        }
    }, [id]);

    const fetchProperty = () => {
        setLoading(true);
        axios.get(`http://localhost:3001/properties/${id}`)
            .then((response) => setProperty(response.data))
            .catch((error) => setError('Error fetching property'))
            .finally(() => setLoading(false));
    };

    const fetchPropertyTypes = () => {
        setLoading(true);
        axios.get('http://localhost:3001/property-types')
            .then((response) => setPropertyTypes(response.data))
            .catch((error) => setError('Error fetching property types'))
            .finally(() => setLoading(false));
    };

    const handleUpdateProperty = () => {
        axios.put(`http://localhost:3001/properties/${id}`, property)
            .then(() => router.push('/properties'))
            .catch((error) => setError('Error updating property'));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <Typography variant="h5" component="h2" gutterBottom>
                Edit Property
            </Typography>
            {loading && <CircularProgress />}
            {error && <Snackbar open={true} message={error} />}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Property Number"
                        name="propertyNumber"
                        value={property.propertyNumber || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Select
                        fullWidth
                        name="propertyType"
                        value={property.propertyType || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select Property Type</MenuItem>
                        {propertyTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={property.name || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={property.address || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={property.city || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={property.state || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipCode"
                        value={property.zipCode || ''}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleUpdateProperty}>
                        Update
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default EditProperty;
