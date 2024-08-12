import React, { useState } from "react";
import { AuthProvider } from "../AuthContext"; // Importer le contexte d'authentification
import Layout from "../components/Layout";
import { CssBaseline } from "@mui/material";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../globale.css";

const MyApp = ({ Component, pageProps }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {/* <CssBaseline /> */}
        <AuthProvider>
          <Layout onSearch={handleSearch}>
            <Component {...pageProps} searchQuery={searchQuery} />
          </Layout>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default MyApp;
