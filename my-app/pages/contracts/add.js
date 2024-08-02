// pages/contracts/add.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import {
    Container,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';

export default function AddContract() {
    const [contract, setContract] = useState({
        property_id: '',
        tenant_id: '',
        start_date: '',
        price: '',
    });
    const [properties, setProperties] = useState([]);
    const [tenants, setTenants] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/listProperties')
            .then(res => res.json())
            .then(data => setProperties(data))
            .catch(err => console.error(err));

        fetch('/api/listTenants')
            .then(res => res.json())
            .then(data => setTenants(data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContract({ ...contract, [name]: value });
    };

    const addContract = async () => {
        const res = await fetch('/api/addContract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contract),
        });
        if (res.ok) {
            alert('Contract added');
            setContract({ property_id: '', tenant_id: '', start_date: '', price: '' });
            router.push('/contracts/list'); // Redirect to the list of contracts
        }
    };

    return (
        <Layout>
            <Container>
                <Typography variant="h5">Add Contract</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Property</InputLabel>
                    <Select name="property_id" value={contract.property_id} onChange={handleChange}>
                        <MenuItem value="">Select Property</MenuItem>
                        {properties.map(property => (
                            <MenuItem key={property.id} value={property.id}>{property.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tenant</InputLabel>
                    <Select name="tenant_id" value={contract.tenant_id} onChange={handleChange}>
                        <MenuItem value="">Select Tenant</MenuItem>
                        {tenants.map(tenant => (
                            <MenuItem key={tenant.id} value={tenant.id}>{tenant.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Start Date"
                    type="date"
                    name="start_date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    value={contract.start_date}
                    onChange={handleChange}
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={contract.price}
                    onChange={handleChange}
                />
                <Button variant="contained" color="primary" onClick={addContract} startIcon={<Add />}>
                    Add Contract
                </Button>
            </Container>
        </Layout>
    );
}
