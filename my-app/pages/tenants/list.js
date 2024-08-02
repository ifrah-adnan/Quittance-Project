// pages/tenants/list.js
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

export default function ListTenants() {
    const [tenants, setTenants] = useState([]);
    const [isCardView, setIsCardView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/listTenants')
            .then(res => res.json())
            .then(data => setTenants(data))
            .catch(err => console.error(err));
    }, []);

    const handleViewChange = () => {
        setIsCardView(!isCardView);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tenant.ice && tenant.ice.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tenant.representative && tenant.representative.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tenant.representative_cin && tenant.representative_cin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tenant.representative_name && tenant.representative_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tenant.representative_prenom && tenant.representative_prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tenant.cin && tenant.cin.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const enterpriseTenants = filteredTenants.filter(tenant => tenant.type === 'enterprise');
    const personTenants = filteredTenants.filter(tenant => tenant.type === 'person');

    return (
        <Layout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">List of Tenants</Typography>
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
                        <Link href="/tenants/add" passHref>
                            <Button variant="contained" color="primary" startIcon={<Add />}>
                                Add Tenant
                            </Button>
                        </Link>
                    </Box>
                </Box>
                <Typography variant="h6">Enterprise Tenants</Typography>
                {isCardView ? (
                    <Box>
                        {enterpriseTenants.map(tenant => (
                            <Box key={tenant.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h6">{tenant.name}</Typography>
                                <Typography>Address: {tenant.address}</Typography>
                                <Typography>Type: {tenant.type}</Typography>
                                <Typography>ICE: {tenant.ice}</Typography>
                                <Typography>Representative: {tenant.representative}</Typography>
                                <Typography>Representative CIN: {tenant.representative_cin}</Typography>
                                <Typography>Representative Name: {tenant.representative_name}</Typography>
                                <Typography>Representative Prenom: {tenant.representative_prenom}</Typography>
                                <Link href={`/tenants/edit?id=${tenant.id}`} passHref>
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>ICE</TableCell>
                                    <TableCell>Representative</TableCell>
                                    <TableCell>Representative CIN</TableCell>
                                    <TableCell>Representative Name</TableCell>
                                    <TableCell>Representative Prenom</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enterpriseTenants.map(tenant => (
                                    <TableRow key={tenant.id}>
                                        <TableCell>{tenant.name}</TableCell>
                                        <TableCell>{tenant.address}</TableCell>
                                        <TableCell>{tenant.type}</TableCell>
                                        <TableCell>{tenant.ice}</TableCell>
                                        <TableCell>{tenant.representative}</TableCell>
                                        <TableCell>{tenant.representative_cin}</TableCell>
                                        <TableCell>{tenant.representative_name}</TableCell>
                                        <TableCell>{tenant.representative_prenom}</TableCell>
                                        <TableCell>
                                            <Link href={`/tenants/edit?id=${tenant.id}`} passHref>
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
                <Typography variant="h6" mt={4}>Person Tenants</Typography>
                {isCardView ? (
                    <Box>
                        {personTenants.map(tenant => (
                            <Box key={tenant.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h6">{tenant.name}</Typography>
                                <Typography>Address: {tenant.address}</Typography>
                                <Typography>Type: {tenant.type}</Typography>
                                <Typography>CIN: {tenant.cin}</Typography>
                                <Link href={`/tenants/edit?id=${tenant.id}`} passHref>
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>CIN</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {personTenants.map(tenant => (
                                    <TableRow key={tenant.id}>
                                        <TableCell>{tenant.name}</TableCell>
                                        <TableCell>{tenant.address}</TableCell>
                                        <TableCell>{tenant.type}</TableCell>
                                        <TableCell>{tenant.cin}</TableCell>
                                        <TableCell>
                                            <Link href={`/tenants/edit?id=${tenant.id}`} passHref>
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
