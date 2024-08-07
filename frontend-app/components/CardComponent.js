import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';

const CardComponent = ({ item, onDelete, onEdit, fields, editLink }) => {
    return (
        <Card>
            <CardContent>
                {fields.map(field => (
                    <Typography key={field} variant="body2" color="textSecondary">
                        {`${field}: ${item[field]}`}
                    </Typography>
                ))}
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    component={Link}
                    href={`${editLink}?id=${item.id}`}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="secondary"
                    onClick={() => onDelete(item.id)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default CardComponent;
