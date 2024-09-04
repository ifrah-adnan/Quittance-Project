import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const EditProperty = () => {
  const router = useRouter();
  const { id } = router.query;

  const [property, setProperty] = useState({});
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapPosition, setMapPosition] = useState([0, 0]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProperty();
      fetchPropertyTypes();
    }
  }, [id]);

  useEffect(() => {
    if (property.address && property.city) {
      getGeocode(property.address, property.city);
    }
  }, [property.address, property.city]);

  const fetchProperty = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/properties/${id}`)
      .then((response) => {
        setProperty(response.data);
        setImages(response.data.images || []); // Suppose que les images sont incluses dans la réponse
        getGeocode(response.data.address, response.data.city);
      })
      .catch(() => setError("Error fetching property"))
      .finally(() => setLoading(false));
  };

  console.log("this is properties", property);
  const fetchPropertyTypes = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/property-types")
      .then((response) => setPropertyTypes(response.data))
      .catch(() => setError("Error fetching property types"))
      .finally(() => setLoading(false));
  };

  const getGeocode = (address, city) => {
    const fullAddress = `${address}, ${city}`;
    axios
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setMapPosition([
            parseFloat(response.data[0].lat),
            parseFloat(response.data[0].lon),
          ]);
        }
      })
      .catch((error) => console.error("Error getting geocode", error));
  };

  const handleUpdateProperty = () => {
    axios
      .put(`http://localhost:3001/properties/${id}`, property)
      .then(() => router.push("/properties"))
      .catch(() => setError("Error updating property"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteImage = (imageId) => {
    axios
      .delete(`http://localhost:3001/properties/${id}/images/${imageId}`)
      .then(() => {
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        );
      })
      .catch(() => setError("Error deleting image"));
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Property
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Number"
            name="propertyNumber"
            value={property.propertyNumber || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            fullWidth
            name="propertyType"
            value={property.propertyType || ""}
            onChange={handleChange}
          >
            <MenuItem value="">Select Property Type</MenuItem>
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={property.name || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={property.address || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={property.city || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={property.state || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={property.zipCode || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ height: 400, width: "100%" }}>
            <MapComponent
              position={mapPosition}
              name={property.name}
              address={property.address}
              city={property.city}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">
            Property Images
          </Typography>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={6} md={4} key={image.id}>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={`http://localhost:3001/${image.url}`}
                    alt={`Property Image ${image.id}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <IconButton
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProperty}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditProperty;
