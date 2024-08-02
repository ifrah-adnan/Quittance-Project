// pages/tenants/edit.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Save } from '@mui/icons-material';

export default function EditTenant() {
    const [tenant, setTenant] = useState({
        type: '',
        name: '',
        ice: '',
        address: '',
        representative: '',
        representative_cin: '',
        representative_name: '',
        representative_prenom: '',
        cin: '',
    });
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            fetch(`/api/getTenant?id=${id}`)
                .then(res => res.json())
                .then(data => setTenant(data))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTenant({ ...tenant, [name]: value });
    };

    const saveTenant = async () => {
        const res = await fetch('/api/updateTenant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...tenant, id }),
        });
        if (res.ok) {
            alert('Tenant updated');
            router.push('/tenants/list'); // Redirect to the list of tenants
        }
    };

    return (
        <Layout>
            <Container>
                <Typography variant="h5">Edit Tenant</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select name="type" value={tenant.type} onChange={handleChange}>
                        <MenuItem value="enterprise">Enterprise</MenuItem>
                        <MenuItem value="person">Person</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Name" name="name" fullWidth margin="normal" value={tenant.name} onChange={handleChange} />
                {tenant.type === 'enterprise' && (
                    <>
                        <TextField label="ICE" name="ice" fullWidth margin="normal" value={tenant.ice} onChange={handleChange} />
                        <TextField label="Representative" name="representative" fullWidth margin="normal" value={tenant.representative} onChange={handleChange} />
                        <TextField label="Representative CIN" name="representative_cin" fullWidth margin="normal" value={tenant.representative_cin} onChange={handleChange} />
                        <TextField label="Representative Name" name="representative_name" fullWidth margin="normal" value={tenant.representative_name} onChange={handleChange} />
                        <TextField label="Representative Prenom" name="representative_prenom" fullWidth margin="normal" value={tenant.representative_prenom} onChange={handleChange} />
                    </>
                )}
                {tenant.type === 'person' && (
                    <TextField label="CIN" name="cin" fullWidth margin="normal" value={tenant.cin} onChange={handleChange} />
                )}
                <TextField label="Address" name="address" fullWidth margin="normal" value={tenant.address} onChange={handleChange} />
                <Button variant="contained" color="primary" onClick={saveTenant} startIcon={<Save />}>
                    Save
                </Button>
            </Container>
        </Layout>
    );
}
