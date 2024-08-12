import React, { useState, useContext } from "react";
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
        <Layout onSearch={handleSearch}>
          <Component {...pageProps} searchQuery={searchQuery} />
        </Layout>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default MyApp;
