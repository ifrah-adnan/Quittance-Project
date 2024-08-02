// pages/properties/add.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Container, TextField, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function AddProperty() {
    const [property, setProperty] = useState({ name: '', address: '', postal_code: '', city: '', land_title: '' });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty({ ...property, [name]: value });
    };

    const addProperty = async () => {
        const res = await fetch('/api/addProperty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(property),
        });
        if (res.ok) {
            alert('Property added');
            setProperty({ name: '', address: '', postal_code: '', city: '', land_title: '' });
            router.push('/properties/list'); // Redirect to the list of properties
        }
    };

    return (
        <Layout>
            <Container>
                <Typography variant="h5">Add Property</Typography>
                <TextField label="Name" name="name" fullWidth value={property.name} onChange={handleChange} />
                <TextField label="Address" name="address" fullWidth value={property.address} onChange={handleChange} />
                <TextField label="Postal Code" name="postal_code" fullWidth value={property.postal_code} onChange={handleChange} />
                <TextField label="City" name="city" fullWidth value={property.city} onChange={handleChange} />
                <TextField label="Land Title" name="land_title" fullWidth value={property.land_title} onChange={handleChange} />
                <Button variant="contained" color="primary" onClick={addProperty} startIcon={<Add />}>
                    Add Property
                </Button>
            </Container>
        </Layout>
    );
}
