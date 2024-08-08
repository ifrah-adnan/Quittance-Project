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
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material";

const Contracts = ({ searchQuery }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  useEffect(() => {
    fetchContracts();
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

  //   const filteredContracts = Array.isArray(contracts)
  //     ? contracts.filter((contract) =>
  //         contract.title.includes(searchQuery.toLowerCase())
  //       )
  //     : [];

  return (
    <Container>
      <div>
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
                <TableCell>Title</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Tenant ID</TableCell>
                <TableCell>Property ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts?.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>ttt</TableCell>
                  <TableCell>{contract.details}</TableCell>
                  <TableCell>{contract.tenantId}</TableCell>
                  <TableCell>{contract.propertyId}</TableCell>
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
      </div>
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
              Are you sure you want to delete the contract "
              {contractToDelete?.title}"?
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
    </Container>
  );
};

export default Contracts;
