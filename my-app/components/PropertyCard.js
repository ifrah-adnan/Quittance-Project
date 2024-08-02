// components/PropertyCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function PropertyCard({ property }) {
    return (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {property.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {property.address}
                </Typography>
                <Typography variant="body2">
                    Postal Code: {property.postal_code}
                </Typography>
                <Typography variant="body2">
                    City: {property.city}
                </Typography>
                <Typography variant="body2">
                    Land Title: {property.land_title}
                </Typography>
            </CardContent>
        </Card>
    );
}
