// pages/contracts/list.js
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
import { Add, Edit } from '@mui/icons-material';

export default function ListContracts() {
    const [contracts, setContracts] = useState([]);
    const [isCardView, setIsCardView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/listContracts')
            .then(res => res.json())
            .then(data => setContracts(data))
            .catch(err => console.error(err));
    }, []);

    const handleViewChange = () => {
        setIsCardView(!isCardView);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredContracts = contracts.filter(contract =>
        contract.property_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.tenant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.start_date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.price.toString().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">List of Contracts</Typography>
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
                        <Link href="/contracts/add" passHref>
                            <Button variant="contained" color="primary" startIcon={<Add />}>
                                Add Contract
                            </Button>
                        </Link>
                    </Box>
                </Box>
                {isCardView ? (
                    <Box>
                        {filteredContracts.map(contract => (
                            <Box key={contract.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h6">Property: {contract.property_name}</Typography>
                                <Typography>Tenant: {contract.tenant_name}</Typography>
                                <Typography>Start Date: {contract.start_date}</Typography>
                                <Typography>Price: {contract.price} DHS</Typography>
                                <Link href={`/contracts/edit?id=${contract.id}`} passHref>
                                    <IconButton edge="end" color="primary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Property</TableCell>
                                    <TableCell>Tenant</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>Price (DHS)</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredContracts.map(contract => (
                                    <TableRow key={contract.id}>
                                        <TableCell>{contract.property_name}</TableCell>
                                        <TableCell>{contract.tenant_name}</TableCell>
                                        <TableCell>{contract.start_date}</TableCell>
                                        <TableCell>{contract.price}</TableCell>
                                        <TableCell>
                                            <Link href={`/contracts/edit?id=${contract.id}`} passHref>
                                                <IconButton edge="end" color="primary">
                                                    <Edit />
                                                </IconButton>
                                            </Link>
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
