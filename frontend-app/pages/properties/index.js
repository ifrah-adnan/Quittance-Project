import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardComponent from "../../components/CardComponent";
import LinkButton from "../../components/LinkButton";

const PropertyStatusDialog = ({ propertyId, open, onClose }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3001/property/${propertyId}/status`
      );
      setStatus(response.data);
    } catch (err) {
      setError("Failed to fetch property status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStatus();
    }
  }, [open, propertyId]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Property Status</DialogTitle>
      <DialogContent>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {status && (
          <>
            <Typography>Rented: {status.isRented ? "Yes" : "No"}</Typography>
            <Typography>Paid: {status.isPaid ? "Yes" : "No"}</Typography>
            {status.contractDetails && (
              <>
                <Typography>
                  Contract Start:{" "}
                  {new Date(
                    status.contractDetails.startDate
                  ).toLocaleDateString()}
                </Typography>
                <Typography>
                  Contract End:{" "}
                  {new Date(
                    status.contractDetails.endDate
                  ).toLocaleDateString()}
                </Typography>
                <Typography>
                  Rent Amount: ${status.contractDetails.rentAmount}
                </Typography>
              </>
            )}
            {status.latestPayment && (
              <>
                <Typography>
                  Latest Payment Due:{" "}
                  {new Date(status.latestPayment.dueDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  Amount Due: ${status.latestPayment.amountDue}
                </Typography>
                <Typography>
                  Amount Paid: ${status.latestPayment.amountPaid}
                </Typography>
                <Typography>
                  Payment Status: {status.latestPayment.paymentStatus}
                </Typography>
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const Properties = ({ searchQuery }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/properties")
      .then((response) => setProperties(response.data))
      .catch(() => setError("Error fetching properties"))
      .finally(() => setLoading(false));
  };

  const handleDeleteProperty = (id) => {
    axios
      .delete(`http://localhost:3001/properties/${id}`)
      .then(() => fetchProperties())
      .catch(() => setError("Error deleting property"));
  };

  const handleViewStatus = (id) => {
    setSelectedPropertyId(id);
    setDialogOpen(true);
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.propertyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Properties
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={3}>
        {filteredProperties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <CardComponent
              item={property}
              onDelete={handleDeleteProperty}
              onEdit={() => {}}
              fields={[
                "name",
                "address",
                "city",
                "state",
                "zipCode",
                "propertyType",
                "propertyNumber",
              ]}
              editLink="/properties/edit"
              onViewStatus={handleViewStatus}
            />
          </Grid>
        ))}
      </Grid>

      <PropertyStatusDialog
        propertyId={selectedPropertyId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      {/* Bouton Add Property en bas à droite */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "background.paper",
          borderRadius: "50%",
        }}
      >
        <LinkButton href="/properties/add">Add Property</LinkButton>
      </Box>
    </div>
  );
};

export default Properties;
