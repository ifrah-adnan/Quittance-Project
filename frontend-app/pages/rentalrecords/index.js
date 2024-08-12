import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StatusChip = styled(Chip)(({ theme, paymentstatus }) => ({
  backgroundColor:
    paymentstatus === "PAID"
      ? theme.palette.success.main
      : paymentstatus === "PARTIAL"
      ? theme.palette.warning.main
      : paymentstatus === "PENDING"
      ? theme.palette.info.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  textTransform: "uppercase",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const RentalRecords = ({ searchQuery }) => {
  const [rentalRecords, setRentalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);

  useEffect(() => {
    fetchRentalRecords();
  }, []);

  const fetchRentalRecords = () => {
    axios
      .get("http://localhost:3001/rentalrecords")
      .then((response) => {
        setRentalRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch rental records.");
        setLoading(false);
        setSnackbarOpen(true);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/rental-payments/${id}`)
      .then(() => {
        setRentalRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== id)
        );
        setSnackbarOpen(true);
      })
      .catch(() => {
        setError("Failed to delete rental record.");
        setSnackbarOpen(true);
      });
  };

  const handleEdit = (id) => {
    window.location.href = `/rentalrecords/edit/${id}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .patch(`http://localhost:3001/rentalrecords/${id}`, {
        paymentStatus: newStatus,
      })
      .then(() => {
        setRentalRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, paymentStatus: newStatus } : record
          )
        );
        setSnackbarOpen(true);
      })
      .catch(() => {
        setError("Failed to update rental record status.");
        setSnackbarOpen(true);
      });
  };

  const filteredRecords = rentalRecords.filter(
    (record) =>
      (record.contract.tenant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        record.contract.property.propertyNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(record.paymentStatus))
  );

  const handleStatusFilterChange = (status) => {
    setStatusFilter((prevFilter) =>
      prevFilter.includes(status)
        ? prevFilter.filter((s) => s !== status)
        : [...prevFilter, status]
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="primary"
        sx={{ mb: 4 }}
      >
        Rental Records
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
            {["PENDING", "PAID", "PARTIAL", "LATE"].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => handleStatusFilterChange(status)}
                color={statusFilter.includes(status) ? "primary" : "default"}
                variant={statusFilter.includes(status) ? "filled" : "outlined"}
              />
            ))}
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="rental records table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Property</StyledTableCell>
                  <StyledTableCell>Tenant</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell align="right">Amount Due</StyledTableCell>
                  <StyledTableCell align="right">Amount Paid</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <StyledTableRow key={record.id}>
                    <TableCell>
                      {record.contract.property.propertyNumber}
                    </TableCell>
                    <TableCell>{record.contract.tenant.name}</TableCell>
                    <TableCell>
                      {new Date(record.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      ${record.amountDue.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${record.amountPaid.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={record.paymentStatus}
                        onChange={(e) =>
                          handleStatusChange(record.id, e.target.value)
                        }
                        size="small"
                        sx={{ width: 120 }}
                      >
                        {["PENDING", "PAID", "PARTIAL", "LATE"].map(
                          (status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(record.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(record.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Add New Record">
          <Button
            variant="contained"
            color="primary"
            href="/rentalrecords/add"
            startIcon={<AddIcon />}
            size="large"
            sx={{
              borderRadius: 28,
              boxShadow: (theme) => theme.shadows[4],
              "&:hover": {
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            Add Record
          </Button>
        </Tooltip>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error || "Operation successful"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RentalRecords;
