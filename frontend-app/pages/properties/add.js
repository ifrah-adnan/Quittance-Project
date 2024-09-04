import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
  Autocomplete,
  Card,
  CardContent,
} from "@mui/material";
import MapPicker from "../../components/MapPicker";
import { useAuth } from "../../AuthContext";

const AddProperty = () => {
  const router = useRouter();
  const { user } = useAuth();
  console.log("this is data for user connected ", user);

  const [property, setProperty] = useState({
    propertyNumber: "",
    propertyType: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = () => {
    setLoading(true);
    axios
      .get("http://localhost:3001/property-types")
      .then((response) => setPropertyTypes(response.data))
      .catch(() => setError("Error fetching property types"))
      .finally(() => setLoading(false));
  };

  const handleAddProperty = () => {
    const propertyData = new FormData();

    Object.keys(property).forEach((key) => {
      propertyData.append(key, property[key]);
    });

    propertyData.append("userId", user.id);

    images.forEach((image) => {
      propertyData.append("images", image);
    });

    axios
      .post("http://localhost:3001/properties", propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => router.push("/properties"))
      .catch((err) => {
        console.error("Error adding property:", err);
        setError("Error adding property");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    router.push("/properties");
  };

  const handleLocationSelect = (addressData) => {
    setProperty((prev) => ({
      ...prev,
      address: addressData.road || "",
      city: addressData.city || addressData.town || addressData.village || "",
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Add Property
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Number"
            name="propertyNumber"
            value={property.propertyNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={propertyTypes}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Property Type" fullWidth />
            )}
            value={property.propertyType}
            onChange={(event, newValue) => {
              setProperty((prev) => ({ ...prev, propertyType: newValue }));
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={property.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={property.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={property.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          {/* Champ d'upload pour les images */}
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
        </Grid>
        <Grid item xs={12}>
          {/* Prévisualisation des images */}
          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div style={{ height: 400, width: "100%" }}>
                <MapPicker onSelectLocation={handleLocationSelect} />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProperty}
          >
            Add Property
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddProperty;
