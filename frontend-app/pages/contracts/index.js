import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  useEffect(() => {
    fetchContracts();
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/contracts")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setContracts(response.data);
        } else {
          setError("Invalid data format");
        }
      })
      .catch((error) => setError("Error fetching contracts"))
      .finally(() => setLoading(false));
  };

  const fetchTenants = () => {
    axios
      .get("http://localhost:3001/tenants")
      .then((response) => setTenants(response.data))
      .catch(() => setError("Error fetching tenants"));
  };

  const fetchProperties = () => {
    axios
      .get("http://localhost:3001/properties")
      .then((response) => setProperties(response.data))
      .catch(() => setError("Error fetching properties"));
  };

  const handleDeleteContract = (contract) => {
    setContractToDelete(contract);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteContract = () => {
    if (contractToDelete) {
      axios
        .delete(`http://localhost:3001/contracts/${contractToDelete.id}`)
        .then(() => {
          fetchContracts();
          setShowDeleteConfirmation(false);
        })
        .catch((error) => setError("Error deleting contract"));
    }
  };

  // Fonction pour obtenir le nom du locataire basé sur l'ID
  const getTenantName = (tenantId) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant ? tenant.name : "Unknown";
  };

  // Fonction pour obtenir le nom de la propriété basé sur l'ID
  const getPropertyAddress = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.propertyNumber : "Unknown";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Contracts
      </Typography>
      {loading && (
        <div className="loader-container">
          <CircularProgress />
        </div>
      )}
      {error && (
        <Snackbar
          open={true}
          message={error}
          autoHideDuration={4000}
          onClose={() => setError("")}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant Name</TableCell>
              <TableCell>Property Number</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Rent Amount</TableCell>
              <TableCell>Terms</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{getTenantName(contract.tenantId)}</TableCell>
                <TableCell>{getPropertyAddress(contract.propertyId)}</TableCell>
                <TableCell>{formatDate(contract.startDate)}</TableCell>
                <TableCell>{formatDate(contract.endDate)}</TableCell>
                <TableCell>{contract.rentAmount}</TableCell>
                <TableCell>{contract.terms}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteContract(contract)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/contracts/edit?id=${contract.id}`}
                    style={{ marginLeft: "8px" }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          borderTop: "1px solid #ccc",
          padding: "16px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="contained" color="primary" href="/contracts/add">
          Add Contract
        </Button>
      </Box>

      {showDeleteConfirmation && (
        <Dialog
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the contract with ID "
              {contractToDelete?.id}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteContract} color="error">
              Delete
            </Button>
            <Button
              onClick={() => setShowDeleteConfirmation(false)}
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Contracts;
