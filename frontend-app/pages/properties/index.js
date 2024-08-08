import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const Properties = ({ searchQuery }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/properties")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          setError("Invalid data format");
        }
      })
      .catch((error) => setError("Error fetching properties"))
      .finally(() => setLoading(false));
  };

  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    setShowDeleteConfirmation(true);
  };
  console.log("this is property to delete ", propertyToDelete);
  const confirmDeleteProperty = () => {
    if (propertyToDelete) {
      axios
        .delete(`http://localhost:3001/properties/${propertyToDelete.id}`)
        .then(() => {
          fetchProperties();
          setShowDeleteConfirmation(false);
        })
        .catch((error) => setError("Error deleting property"));
    }
  };

  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Container>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Properties
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
        <Grid container spacing={3} className="w-full">
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
              <Card
                className="property-card h-full min-h-[300px] flex flex-col justify-between"
                sx={{ height: "100%", minHeight: "300px" }}
              >
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {property.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {property.address}, {property.city}, {property.state}{" "}
                    {property.zipCode}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Property Type: {property.propertyType}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Property Number: {property.propertyNumber}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProperty(property)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/properties/edit?id=${property.id}`}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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
        <Button variant="contained" color="primary" href="/properties/add">
          Add Property
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
              Are you sure you want to delete the property "
              {propertyToDelete?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDeleteProperty} color="error">
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

export default Properties;
