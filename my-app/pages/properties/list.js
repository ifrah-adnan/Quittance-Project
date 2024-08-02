// pages/properties/list.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import PropertyCard from '../../components/PropertyCard';
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

export default function ListProperties() {
    const [properties, setProperties] = useState([]);
    const [isCardView, setIsCardView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/listProperties')
            .then(res => res.json())
            .then(data => setProperties(data))
            .catch(err => console.error(err));
    }, []);

    const handleViewChange = () => {
        setIsCardView(!isCardView);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProperties = properties.filter(property =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.postal_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.land_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">List of Properties</Typography>
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
                        <Link href="/properties/add" passHref>
                            <Button variant="contained" color="primary" startIcon={<Add />}>
                                Add Property
                            </Button>
                        </Link>
                    </Box>
                </Box>
                {isCardView ? (
                    <Box>
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Postal Code</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Land Title</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProperties.map(property => (
                                    <TableRow key={property.id}>
                                        <TableCell>{property.name}</TableCell>
                                        <TableCell>{property.address}</TableCell>
                                        <TableCell>{property.postal_code}</TableCell>
                                        <TableCell>{property.city}</TableCell>
                                        <TableCell>{property.land_title}</TableCell>
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
