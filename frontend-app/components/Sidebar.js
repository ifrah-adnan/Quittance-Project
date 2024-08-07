import React from 'react';
import Link from 'next/link';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <List>
                <ListItem button component={Link} href="/properties">
                    <ListItemText primary="Properties" />
                </ListItem>
                <ListItem button component={Link} href="/tenants">
                    <ListItemText primary="Tenants" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
