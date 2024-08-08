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
  Select,
  MenuItem,
} from "@mui/material";

const AddProperty = () => {
  const router = useRouter();

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
    axios
      .post("http://localhost:3001/properties", property)
      .then(() => router.push("/properties"))
      .catch(() => setError("Error adding property"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => {
    router.push("/properties");
  };

  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
    "Kenitra",
    "Tétouan",
    "Safi",
    "El Jadida",
    "Nador",
    "Beni Mellal",
    "Khouribga",
    "Settat",
    "Salé",
    "Mohammedia",
    "Taza",
    "Guelmim",
    "Laâyoune",
    "Dakhla",
    "Errachidia",
    "Ouarzazate",
    "Taourirt",
    "Khénifra",
    "Ifrane",
    "Berrechid",
    "Inezgane",
    "Temara",
    "Berkane",
    "Chefchaouen",
    "Témara",
    "Larache",
    "Azrou",
    "Ksar El Kebir",
    "Tiznit",
    "Sidi Kacem",
    "Alhucemas",
    "Essaouira",
    "Ouled Teima",
    "Boulemane",
    "Sidi Slimane",
    "Sidi Bennour",
    "Midelt",
    "Tan-Tan",
    "Taghjijt",
    "Imilchil",
    "Taounate",
    "Ouazzane",
    "Taroudannt",
    "Boujdour",
    "Assa",
    "Figuig",
    "Jrada",
    "Tinghir",
    "Sidi Ifni",
    "Rissani",
    "Zagora",
    "Sidi Yahya El Gharb",
    "Tarfaya",
    "Tazenakht",
    "Imintanoute",
    "Tahanaout",
    "Sidi Rahhal",
    "Sidi Allal El Bahraoui",
    "Skhirate",
    "Sidi Slimane Echcharraa",
    "Sidi Kacem",
    "Sidi Hajjaj",
    "Sidi Bouknadel",
    "Sidi Bennour",
    "Sidi Allal Tazi",
    "Sefrou",
    "Ouled Abbou",
    "Ouled Ayad",
    "Oualidia",
    "Moulay Bousselham",
    "Moulay Idriss Zerhoun",
    "Missour",
    "Médiouna",
    "Ksar Sghir",
    "Kénitra",
    "Ksabi",
    "Jorf Lasfar",
    "Hrara",
    "Hennaïa",
    "Guercif",
    "Goulmima",
    "Fnideq",
    "Dakhla",
    "Dcheira El Jihadia",
    "Dar Bouazza",
    "Dar Chaoui",
    "Bouknadel",
    "Bouanane",
    "Bir Anzarane",
    "Birkhadem",
    "Ben Slimane",
    "Asilah",
    "Arfoud",
    "Ain Harrouda",
    "Ain Dorij",
    "Ain Aïcha",
    "Ahfir",
    "Aghbalou",
    "Agadir",
    "Zenata",
    "Youssoufia",
    "Témara",
    "Tanger",
    "Tata",
    "Taza",
    "Taourirt",
    "Taounate",
    "Taroudannt",
    "Tan-Tan",
    "Tangier",
    "Tangier-Assilah",
    "Tétouan",
    "Tiznit",
    "Salé",
    "Safi",
    "Settat",
    "Sidi Slimane",
    "Sidi Kacem",
    "Sidi Ifni",
    "Skhirate-Témara",
    "Tinghir",
    "Khenifra",
    "Khouribga",
    "Khémisset",
    "Kenitra",
    "Laâyoune",
    "Larache",
    "Marrakech",
    "Meknès",
    "Mohammadia",
    "Nador",
    "Nouaceur",
    "Ouarzazate",
    "Oujda",
    "Oued Zem",
    "Rabat",
    "Rissani",
    "Beni Mellal",
    "Casablanca",
    "Dakhla",
    "Errachidia",
    "Essaouira",
    "Fès",
    "Figuig",
    "Guercif",
    "Guelmim",
    "Inezgane",
    "Imilchil",
    "Azrou",
    "Berkane",
    "Berrechid",
    "Boujdour",
    "Boulemane",
    "Chefchaouen",
    "Dakhla-Oued Ed-Dahab",
    "El Jadida",
    "Erfoud",
    "Errachidia",
    "Essaouira",
    "Fès",
    "Figuig",
    "Guelmim",
    "Guercif",
    "Ifrane",
    "Inezgane",
    "Kénitra",
    "Khouribga",
    "Khémisset",
    "Khenifra",
    "Laâyoune",
    "Larache",
    "Marrakech",
    "Meknès",
    "Midelt",
    "Mohammadia",
    "Nador",
    "Ouarzazate",
    "Oujda",
    "Ouled Teima",
    "Oued Zem",
    "Rabat",
    "Rissani",
    "Safi",
    "Salé",
    "Sefrou",
    "Settat",
    "Sidi Bennour",
    "Sidi Ifni",
    "Sidi Kacem",
    "Sidi Slimane",
    "Skhirate-Témara",
    "Tanger",
    "Tan-Tan",
    "Taounate",
    "Taourirt",
    "Taroudannt",
    "Tata",
    "Taza",
    "Tétouan",
    "Tiznit",
    "Tinghir",
    "Zagora",
  ];

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
            options={cities}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="City" fullWidth />
            )}
            value={property.city}
            onChange={(event, newValue) => {
              setProperty((prev) => ({ ...prev, city: newValue }));
            }}
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
            label="State"
            name="state"
            value={property.state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={property.zipCode}
            onChange={handleChange}
          />
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
