// pages/properties/edit.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Container, TextField, Button, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';

export default function EditProperty() {
    const [property, setProperty] = useState({ name: '', address: '', postal_code: '', city: '', land_title: '' });
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetch(`/api/getProperty?id=${id}`)
                .then(res => res.json())
                .then(data => setProperty(data))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty({ ...property, [name]: value });
    };

    const saveProperty = async () => {
        const res = await fetch('/api/updateProperty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...property, id }),
        });
        if (res.ok) {
            alert('Property updated');
            router.push('/properties/list'); // Redirect to the list of properties
        }
    };

    return (
        <Layout>
            <Container>
                <Typography variant="h5">Edit Property</Typography>
                <TextField label="Name" name="name" fullWidth value={property.name} onChange={handleChange} margin="normal" />
                <TextField label="Address" name="address" fullWidth value={property.address} onChange={handleChange} margin="normal" />
                <TextField label="Postal Code" name="postal_code" fullWidth value={property.postal_code} onChange={handleChange} margin="normal" />
                <TextField label="City" name="city" fullWidth value={property.city} onChange={handleChange} margin="normal" />
                <TextField label="Land Title" name="land_title" fullWidth value={property.land_title} onChange={handleChange} margin="normal" />
                <Button variant="contained" color="primary" onClick={saveProperty} startIcon={<Save />}>
                    Save
                </Button>
            </Container>
        </Layout>
    );
}
