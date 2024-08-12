import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Grid,
  Box,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardComponent from "../../components/CardComponent";

const Properties = ({ searchQuery }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            />
          </Grid>
        ))}
      </Grid>

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
        <Button
          variant="contained"
          color="primary"
          href="/properties/add"
          startIcon={<AddIcon />}
          size="large"
        >
          Add Property
        </Button>
      </Box>
    </div>
  );
};

export default Properties;
