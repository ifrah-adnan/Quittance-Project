// pages/properties/list.js
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
                            <Box key={property.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                                <Typography variant="h6">{property.name}</Typography>
                                <Typography>Address: {property.address}</Typography>
                                <Typography>Postal Code: {property.postal_code}</Typography>
                                <Typography>City: {property.city}</Typography>
                                <Typography>Land Title: {property.land_title}</Typography>
                                <Link href={`/properties/edit?id=${property.id}`} passHref>
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
                                    <TableCell>Postal Code</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Land Title</TableCell>
                                    <TableCell>Actions</TableCell>
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
                                        <TableCell>
                                            <Link href={`/properties/edit?id=${property.id}`} passHref>
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
