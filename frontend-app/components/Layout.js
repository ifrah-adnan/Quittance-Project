import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../AuthContext";

import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
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
const Layout = ({ children, onSearch, exclude }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  console.log("this is data for user connected2 ", user);

  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  if (!mounted) return null;

  return (
    <div style={{ display: "flex" }}>
      {isAuthenticated && user?.role !== "ADMIN" && <Sidebar />}
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {isAuthenticated && (
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
              <IconButton onClick={toggleTheme} sx={{ color: "#24292f" }}>
                {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
              </IconButton>
              <Button
                onClick={handleMenuOpen}
                startIcon={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {user?.name?.charAt(0)}
                  </Avatar>
                }
              >
                {user?.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </StyledToolbar>
          </StyledAppBar>
        )}
        <Box component="main" sx={{ flexGrow: 1, p: 1, marginTop: "64px" }}>
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
