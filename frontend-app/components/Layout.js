import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Moon, Sun } from "lucide-react";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#24292f",
  boxShadow: "none",
  borderBottom: "1px solid #e1e4e8",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  "@media (min-width: 600px)": {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const StyledSearchInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: "#fafbfc",
  border: "1px solid #e1e4e8",
  borderRadius: 6,
  color: "#24292f",
  padding: theme.spacing(1),
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: "100%",
  "@media (min-width: 600px)": {
    width: "auto",
    flex: 1,
  },
  "&::placeholder": {
    color: "#6a737d",
  },
}));

const Layout = ({ children, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (typeof onSearch === "function") {
      onSearch(newSearchTerm);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) return null; // Ne rend rien avant le premier rendu

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <StyledAppBar position="static">
          <StyledToolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              MyApp
            </Typography>
            <div className="relative">
              <StyledSearchInput
                placeholder="Search or jump to..."
                value={searchTerm}
                onChange={handleSearchChange}
                startAdornment={
                  <IconButton>
                    <Search className="text-gray-400" size={18} />
                  </IconButton>
                }
              />
            </div>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "#24292f",
              }}
            >
              {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
            </IconButton>
          </StyledToolbar>
        </StyledAppBar>
        <Container sx={{ marginTop: 4 }}>{children}</Container>
      </Box>
    </div>
  );
};

export default Layout;
