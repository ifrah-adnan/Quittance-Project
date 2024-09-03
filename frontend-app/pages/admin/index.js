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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { ViewList, ViewModule, Person } from "@mui/icons-material";
import axios from "axios";
import { motion } from "framer-motion";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedContract, setSelectedContract] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        User Management
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
          sx={{ backgroundColor: "white", boxShadow: 1 }}
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box mt={3}>
        {viewMode === "list" ? (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Properties</TableCell>
                  <TableCell>Tenants</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === "USER" ? "primary" : "secondary"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.properties.map((property) => (
                        <Chip
                          key={property.id}
                          label={property.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {user.tenants.map((tenant) => (
                        <Chip
                          key={tenant.id}
                          label={tenant.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      {user.tenants
                        .flatMap((tenant) => tenant.contracts)
                        .map((contract) => (
                          <Button
                            key={contract.id}
                            onClick={() => handleOpenDialog(contract)}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          >
                            Contract {contract.id}
                          </Button>
                        ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {users.map((user) => (
                <Grid item xs={12} sm={6} md={4} key={user.id}>
                  <motion.div variants={itemVariants}>
                    <Card elevation={3}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                            {user.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{user.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email}
                            </Typography>
                            <Chip
                              label={user.role}
                              color={
                                user.role === "USER" ? "primary" : "secondary"
                              }
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Properties:
                        </Typography>
                        <Box mb={1}>
                          {user.properties.map((property) => (
                            <Chip
                              key={property.id}
                              label={property.name}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Tenants:
                        </Typography>
                        <Box mb={1}>
                          {user.tenants.map((tenant) => (
                            <Chip
                              key={tenant.id}
                              label={tenant.name}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Contracts:
                        </Typography>
                        <Box>
                          {user.tenants
                            .flatMap((tenant) => tenant.contracts)
                            .map((contract) => (
                              <Button
                                key={contract.id}
                                onClick={() => handleOpenDialog(contract)}
                                variant="outlined"
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              >
                                Contract {contract.id}
                              </Button>
                            ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Contract Details</DialogTitle>
        <DialogContent dividers>
          {selectedContract && (
            <>
              <Typography variant="h6" gutterBottom>
                Contract ID: {selectedContract.id}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Tenant ID: {selectedContract.tenantId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Property ID: {selectedContract.propertyId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    Start Date:{" "}
                    {new Date(selectedContract.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    End Date:{" "}
                    {new Date(selectedContract.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Rent Amount: ${selectedContract.rentAmount}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Terms: {selectedContract.terms}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Payments
              </Typography>
              {selectedContract.rentalPayments.map((payment) => (
                <Paper key={payment.id} elevation={1} sx={{ p: 2, mb: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2">
                        Amount Due: ${payment.amountDue}
                      </Typography>
                      <Typography variant="body2">
                        Amount Paid: ${payment.amountPaid}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Chip
                        label={payment.paymentStatus}
                        color={getPaymentStatusColor(payment.paymentStatus)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "PAID":
      return "success";
    case "PARTIAL":
      return "warning";
    case "PENDING":
      return "error";
    default:
      return "default";
  }
};

export default AdminUsersPage;
