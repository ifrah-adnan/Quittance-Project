import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Autocomplete,
  Grid,
  Typography,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const CreateRentalRecord = () => {
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState({
    contractId: "",
    dueDate: "",
    amountDue: "",
    amountPaid: "",
    paymentStatus: "PENDING",
  });
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    axios
      .get("http://localhost:3001/contracts")
      .then((response) => setContracts(response.data))
      .catch(() => setError("Error fetching contracts"));
  };
  const handleCreateRecord = () => {
    console.log("this is data ", form);

    const formattedForm = {
      ...form,
      dueDate: form.dueDate
        ? new Date(form.dueDate).toISOString().split("T")[0]
        : null,
      amountDue: parseFloat(form.amountDue),
      amountPaid: parseFloat(form.amountPaid),
    };

    // Send POST request to backend
    axios
      .post("http://localhost:3001/rental-payments", {
        contractId: formattedForm.contractId,
        dueDate: formattedForm.dueDate,
        amountDue: formattedForm.amountDue,
        amountPaid: formattedForm.amountPaid,
        paymentStatus: formattedForm.paymentStatus,
      })
      .then(() => {
        setForm({
          contractId: "",
          dueDate: "",
          amountDue: "",
          amountPaid: "",
          paymentStatus: "PENDING",
        });
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setError(
          error.response?.data?.message || "Error creating rental record"
        );
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  console.log("this is data ", contracts);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Create Rental Payment Record
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            options={contracts}
            getOptionLabel={(option) =>
              `Contract for tenant : ${option.tenant.name} & property: ${option.property.propertyNumber} `
            }
            renderInput={(params) => (
              <TextField {...params} label="Select Contract" />
            )}
            value={contracts.find((c) => c.id === form.contractId) || null}
            onChange={(event, newValue) =>
              setForm((prev) => ({ ...prev, contractId: newValue?.id || "" }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount Due"
            type="text"
            value={form.amountDue}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amountDue: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount Paid"
            type="text"
            value={form.amountPaid}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amountPaid: e.target.value }))
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Payment Status"
            select
            SelectProps={{
              native: true,
            }}
            value={form.paymentStatus}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, paymentStatus: e.target.value }))
            }
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="LATE">Late</option>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRecord}
          >
            Create Rental Record
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error || "Rental record created successfully"}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default CreateRentalRecord;
