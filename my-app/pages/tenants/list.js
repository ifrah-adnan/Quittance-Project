// pages/tenants/list.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import TenantCard from '../../components/TenantCard';
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
} from '@mui/material';
import { Add } from '@mui/icons-material';

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
                {isCardView ? (
                    <Box>
                        {filteredTenants.map(tenant => (
                            <TenantCard key={tenant.id} tenant={tenant} />
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
                                    {tenants.some(tenant => tenant.type === 'enterprise') && (
                                        <>
                                            <TableCell>ICE</TableCell>
                                            <TableCell>Representative</TableCell>
                                            <TableCell>Representative CIN</TableCell>
                                            <TableCell>Representative Name</TableCell>
                                            <TableCell>Representative Prenom</TableCell>
                                        </>
                                    )}
                                    {tenants.some(tenant => tenant.type === 'person') && (
                                        <TableCell>CIN</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTenants.map(tenant => (
                                    <TableRow key={tenant.id}>
                                        <TableCell>{tenant.name}</TableCell>
                                        <TableCell>{tenant.address}</TableCell>
                                        <TableCell>{tenant.type}</TableCell>
                                        {tenant.type === 'enterprise' && (
                                            <>
                                                <TableCell>{tenant.ice}</TableCell>
                                                <TableCell>{tenant.representative}</TableCell>
                                                <TableCell>{tenant.representative_cin}</TableCell>
                                                <TableCell>{tenant.representative_name}</TableCell>
                                                <TableCell>{tenant.representative_prenom}</TableCell>
                                            </>
                                        )}
                                        {tenant.type === 'person' && (
                                            <TableCell>{tenant.cin}</TableCell>
                                        )}
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
