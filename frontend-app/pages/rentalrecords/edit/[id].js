import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
} from "@mui/material";

const EditRentalPayment = () => {
  const router = useRouter();
  const { id } = router.query;

  const [rentalPayment, setRentalPayment] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchRentalPayment();
    }
  }, [id]);

  const fetchRentalPayment = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/rental-payments/${id}`)
      .then((response) => setRentalPayment(response.data))
      .catch((error) => setError("Error fetching rental payment"))
      .finally(() => setLoading(false));
  };

  const handleUpdateRentalPayment = () => {
    axios
      .put(`http://localhost:3001/rental-payments/${id}`, rentalPayment)
      .then(() => router.push("/rentalrecords"))
      .catch((error) => setError("Error updating rental payment"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRentalPayment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Rental Payment
      </Typography>
      {loading && <CircularProgress />}
      {error && <Snackbar open={true} message={error} />}
      <Grid container spacing={2}>
        {/* <Grid item xs={12} md={6}>
          <TextField
            type="hidden"
            fullWidth
            label="Contract ID"
            name="contractId"
            value={rentalPayment.contractId || ""}
            onChange={handleChange}
          />
        </Grid> */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            value={
              rentalPayment.dueDate ? rentalPayment.dueDate.split("T")[0] : ""
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Amount Due"
            name="amountDue"
            value={rentalPayment.amountDue || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Amount Paid"
            name="amountPaid"
            value={rentalPayment.amountPaid || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            fullWidth
            name="paymentStatus"
            value={rentalPayment.paymentStatus || ""}
            onChange={handleChange}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="PARTIAL">Partial</MenuItem>
            <MenuItem value="LATE">Late</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Payment Date"
            name="paymentDate"
            value={
              rentalPayment.paymentDate
                ? rentalPayment.paymentDate.split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateRentalPayment}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditRentalPayment;
