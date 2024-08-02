// pages/payments/list.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import {
    Container,
    Typography,
    Button,
    Box,
    FormControlLabel,
    Switch,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import { Add, Done } from '@mui/icons-material';

export default function ListPayments() {
    const [payments, setPayments] = useState([]);
    const [isCardView, setIsCardView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    useEffect(() => {
        fetch('/api/listPayments')
            .then(res => res.json())
            .then(data => setPayments(data))
            .catch(err => console.error(err));
    }, []);

    const handleViewChange = () => {
        setIsCardView(!isCardView);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePaymentDateChange = (e) => {
        setPaymentDate(e.target.value);
    };

    const updatePayment = async (id) => {
        const res = await fetch('/api/updatePayment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'paid', payment_date: paymentDate }),
        });
        if (res.ok) {
            alert('Payment status updated');
            setPaymentDate('');  // Reset the payment date
            fetchPayments();
        }
    };

    const fetchPayments = async () => {
        const res = await fetch('/api/listPayments');
        if (!res.ok) {
            console.error('Failed to fetch payments');
            return;
        }
        const data = await res.json();
        setPayments(data);
    };

    const filteredPayments = payments.filter(payment =>
        payment.contract_id.toString().includes(searchQuery.toLowerCase()) ||
        payment.due_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.amount.toString().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">List of Payments</Typography>
                    <Box display="flex" alignItems="center">
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ marginRight: '16px' }}
                        />
                        <FormControlLabel
                            control={<Switch checked={isCardView} onChange={handleViewChange} />}
                            label="Card View"
                        />
                        <Link href="/payments/add" passHref>
                            <Button variant="contained" color="primary" startIcon={<Add />}>
                                Add Payment
                            </Button>
                        </Link>
                    </Box>
                </Box>
                {isCardView ? (
                    <Box>
                        {filteredPayments.map(payment => (
                            <Box key={payment.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h6">Contract ID: {payment.contract_id}</Typography>
                                <Typography>Due Date: {payment.due_date}</Typography>
                                <Typography>Amount: {payment.amount} DHS</Typography>
                                <Typography>Status: {payment.status}</Typography>
                                {payment.status === 'paid' && (
                                    <Typography>Payment Date: {payment.payment_date}</Typography>
                                )}
                                {payment.status === 'pending' && (
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            label="Payment Date"
                                            type="date"
                                            name="payment_date"
                                            InputLabelProps={{ shrink: true }}
                                            value={paymentDate}
                                            onChange={handlePaymentDateChange}
                                            style={{ marginRight: '16px' }}
                                        />
                                        <IconButton edge="end" color="primary" onClick={() => updatePayment(payment.id)}>
                                            <Done />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Contract ID</TableCell>
                                    <TableCell>Due Date</TableCell>
                                    <TableCell>Amount (DHS)</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Payment Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.map(payment => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{payment.contract_id}</TableCell>
                                        <TableCell>{payment.due_date}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>{payment.status}</TableCell>
                                        <TableCell>{payment.payment_date || 'N/A'}</TableCell>
                                        <TableCell>
                                            {payment.status === 'pending' && (
                                                <Box display="flex" alignItems="center">
                                                    <TextField
                                                        label="Payment Date"
                                                        type="date"
                                                        name="payment_date"
                                                        InputLabelProps={{ shrink: true }}
                                                        value={paymentDate}
                                                        onChange={handlePaymentDateChange}
                                                        style={{ marginRight: '16px' }}
                                                    />
                                                    <IconButton edge="end" color="primary" onClick={() => updatePayment(payment.id)}>
                                                        <Done />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </Layout>
    );
}
