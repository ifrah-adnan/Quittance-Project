// components/Layout.js
import React from 'react';
import { Container, List, ListItem, ListItemText, Drawer, CssBaseline, AppBar, Toolbar, Box, Typography } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

export default function Layout({ children }) {
    return (
        <div style={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Property Management
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component={Link} href="/properties/list">
                            <ListItemText primary="List Properties" />
                        </ListItem>
                        <ListItem button component={Link} href="/tenants/list">
                            <ListItemText primary="List Tenants" />
                        </ListItem>
                        <ListItem button component={Link} href="/contracts/list">
                            <ListItemText primary="List Contracts" />
                        </ListItem>
                        <ListItem button component={Link} href="/payments/list">
                            <ListItemText primary="List Payments" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                <Container>
                    {children}
                </Container>
            </Box>
        </div>
    );
}
