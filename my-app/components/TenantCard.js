// components/TenantCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function TenantCard({ tenant }) {
    return (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {tenant.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {tenant.address}
                </Typography>
                <Typography variant="body2">
                    Type: {tenant.type}
                </Typography>
                {tenant.type === 'enterprise' && (
                    <>
                        <Typography variant="body2">
                            ICE: {tenant.ice}
                        </Typography>
                        <Typography variant="body2">
                            Representative: {tenant.representative}
                        </Typography>
                        <Typography variant="body2">
                            Representative CIN: {tenant.representative_cin}
                        </Typography>
                        <Typography variant="body2">
                            Representative Name: {tenant.representative_name}
                        </Typography>
                        <Typography variant="body2">
                            Representative Prenom: {tenant.representative_prenom}
                        </Typography>
                    </>
                )}
                {tenant.type === 'person' && (
                    <Typography variant="body2">
                        CIN: {tenant.cin}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
