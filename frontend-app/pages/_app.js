import React, { useState } from 'react';
import Layout from '../components/Layout';
import { CssBaseline } from '@mui/material';

const MyApp = ({ Component, pageProps }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <>
            <CssBaseline />
            <Layout onSearch={handleSearch}>
                <Component {...pageProps} searchQuery={searchQuery} />
            </Layout>
        </>
    );
};

export default MyApp;
