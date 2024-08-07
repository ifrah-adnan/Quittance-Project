import React from 'react';
import Sidebar from './Sidebar';
import { Container, AppBar, Toolbar, Typography, InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const Layout = ({ children, onSearch }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            MyApp
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
                <Container sx={{ marginTop: 4 }}>{children}</Container>
            </Box>
        </div>
    );
};

export default Layout;
