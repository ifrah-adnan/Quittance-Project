// pages/payments/add.js
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

export default function AddPayment() {
    const [payment, setPayment] = useState({
        contract_id: '',
        due_date: '',
        amount: '',
    });
    const [contracts, setContracts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/listContracts')
            .then(res => res.json())
            .then(data => setContracts(data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment({ ...payment, [name]: value });
    };

    const addPayment = async () => {
        const res = await fetch('/api/addPayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment),
        });
        if (res.ok) {
            alert('Payment added');
            setPayment({ contract_id: '', due_date: '', amount: '' });
            router.push('/payments/list'); // Redirect to the list of payments
        }
    };

    return (
        <Layout>
            <Container>
                <Typography variant="h5">Add Payment</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Contract</InputLabel>
                    <Select name="contract_id" value={payment.contract_id} onChange={handleChange}>
                        <MenuItem value="">Select Contract</MenuItem>
                        {contracts.map(contract => (
                            <MenuItem key={contract.id} value={contract.id}>Contract {contract.id}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Due Date"
                    type="date"
                    name="due_date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    value={payment.due_date}
                    onChange={handleChange}
                />
                <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={payment.amount}
                    onChange={handleChange}
                />
                <Button variant="contained" color="primary" onClick={addPayment} startIcon={<Add />}>
                    Add Payment
                </Button>
            </Container>
        </Layout>
    );
}
