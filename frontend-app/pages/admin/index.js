import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { ViewList, ViewModule, Person } from "@mui/icons-material";
import axios from "axios";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [selectedContract, setSelectedContract] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleOpenDialog = (contract) => {
    setSelectedContract(contract);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedContract(null);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Users Management
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {viewMode === "list" ? (
        <ListView users={users} onContractClick={handleOpenDialog} />
      ) : (
        <GridView users={users} onContractClick={handleOpenDialog} />
      )}
      <ContractDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        contract={selectedContract}
      />
    </Box>
  );
};

const ListView = ({ users, onContractClick }) => (
  <TableContainer
    component={Paper}
    elevation={3}
    sx={{ borderRadius: 2, overflow: "hidden" }}
  >
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow
          sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
        >
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            User
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Role
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Property
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Tenant
          </TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: (theme) => theme.palette.secondary.main,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Chip label={user.role} color="primary" size="small" />
            </TableCell>
            <TableCell>
              {user.property ? user.property.name : "No Property"}
            </TableCell>
            <TableCell>
              {user.tenant ? user.tenant.name : "No Tenant"}
            </TableCell>
            <TableCell>
              {user.tenant &&
                user.tenant.contracts.map((contract) => (
                  <Button
                    key={contract.id}
                    variant="outlined"
                    onClick={() => onContractClick(contract)}
                  >
                    View Details
                  </Button>
                ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const GridView = ({ users, onContractClick }) => (
  <Grid container spacing={3}>
    {users.map((user) => (
      <Grid item xs={12} sm={6} md={4} key={user.id}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ mr: 2, bgcolor: (theme) => theme.palette.secondary.main }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6">{user.name}</Typography>
                <Typography color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>
            <Chip
              label={user.role}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Property:</strong>{" "}
              {user.property ? user.property.name : "No Property"}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Tenant:</strong>{" "}
              {user.tenant ? user.tenant.name : "No Tenant"}
            </Typography>
            {user.tenant && user.tenant.contracts.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => onContractClick(user.tenant.contracts[0])} // Assumes first contract for simplicity
              >
                View Details
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ContractDialog = ({ open, onClose, contract }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Contract Details</DialogTitle>
    <DialogContent>
      {contract && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {contract.property?.name || "No Property"}
          </Typography>
          <Typography variant="body1">
            <strong>Start Date:</strong>{" "}
            {new Date(contract.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>End Date:</strong>{" "}
            {new Date(contract.endDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            <strong>Rent Amount:</strong> ${contract.rentAmount}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong>{" "}
            <Chip
              label={
                contract.rentalPayments.length > 0
                  ? "Has Payments"
                  : "No Payments"
              }
              color={contract.rentalPayments.length > 0 ? "success" : "warning"}
            />
          </Typography>
        </Box>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default AdminUsersPage;
