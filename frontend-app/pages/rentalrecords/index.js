import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useAuth } from "../../AuthContext";

const StatusChip = styled(Chip)(({ theme, paymentstatus }) => ({
  backgroundColor:
    paymentstatus === "PAID"
      ? theme.palette.success.main
      : paymentstatus === "PARTIAL"
      ? theme.palette.warning.main
      : paymentstatus === "PENDING"
      ? theme.palette.info.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  textTransform: "uppercase",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const RentalRecords = ({ searchQuery }) => {
  const [rentalRecords, setRentalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    fetchRentalRecords();
  }, []);

  const fetchRentalRecords = () => {
    axios
      .get("http://localhost:3001/rentalrecords")
      .then((response) => {
        setRentalRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch rental records.");
        setLoading(false);
        setSnackbarOpen(true);
      });
  };
  console.log("this is data ", rentalRecords);
  const generateRentReceipt = (record) => {
    const doc = new jsPDF();

    // Ajouter un fond légèrement gris pour simuler une photocopie
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 210, 297, "F");

    // Configuration de la police
    doc.setFont("helvetica");
    doc.setFontSize(10);

    // Titre principal
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204); // Bleu
    doc.text("QUITTANCE DE LOYER", 105, 20, null, null, "center");

    // Détails de la quittance
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Noir

    // Référence de la quittance
    doc.text(`REF : QL ${record.id.slice(0, 8)}`, 20, 30);

    // Mois de la quittance
    const formattedDate = new Date(record.dueDate).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text(`Quittance de loyer du mois de ${formattedDate}`, 20, 40);

    // Adresse du bien
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(`Adresse du bien : ${record.contract.property.city}`, 20, 50);
    doc.text(`Code postal : ${record.contract.property.zipCode}`, 20, 55);
    doc.text(`Ville : ${record.contract.property.city}`, 20, 60);
    doc.text("Titre foncier : N°T-45/89862", 20, 65);

    // Informations du déclarant
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text("Déclarant :", 20, 75);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(
      "Je soussigné(e), [NOM DE LA SOCIÉTÉ] Unique, immatriculée au registre de commerce de",
      20,
      80
    );
    doc.text(
      `Casablanca sous le numéro 541253, représentée par son gérant unique ${user.name},`,
      20,
      85
    );
    doc.text(
      "titulaire de la [carte nation], propriétaire du logement désigné ci-dessus,",
      20,
      90
    );

    // Informations sur le locataire
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text("Déclare avoir reçu de :", 20, 100);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(
      `La société ${record.contract.tenant.name}, ICE xx, siège social ${record.contract.tenant.address},`,
      20,
      105
    );
    doc.text(
      `représentée par son gérant M/me ${record.contract.tenant.contactName}, titulaire de la CIN N° ${record.contract.tenant.contactCin},`,
      20,
      110
    );
    doc.text(`Demeurant à ${record.contract.tenant.address},`, 20, 115);

    // Somme reçue
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text("La somme de :", 20, 125);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(
      `${record.amountPaid.toFixed(2)} dirhams ( ${numberToWords(
        record.amountPaid
      )} dirhams ),`,
      20,
      130
    );

    // Détails de la période de location
    const startDate = new Date(record.dueDate).toLocaleDateString("fr-FR");
    const endDate = new Date(record.dueDate).toLocaleDateString("fr-FR");

    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text("Au titre de :", 20, 140);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(
      `Paiement du loyer pour la période de location du ${startDate} au ${endDate} : ${record.amountDue.toFixed(
        2
      )} DHS`,
      20,
      145
    );

    // Clause de quittance
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(
      "Et lui en donne quittance, sous réserve de tous mes droits.",
      20,
      155
    );

    // Détails du règlement
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Bleu pour le titre
    doc.text("DÉTAIL DU RÈGLEMENT :", 20, 165);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Noir
    doc.text(`Loyer : ${record.amountDue.toFixed(2)} Dirhams`, 30, 170);
    doc.text("Provision pour charges : 0,00 Dirhams", 30, 175);
    doc.text(`Total : ${record.amountDue.toFixed(2)} Dirhams`, 30, 180);
    doc.text(
      `Date du paiement : ${
        record.paymentDate
          ? new Date(record.paymentDate).toLocaleDateString("fr-FR")
          : "Non payé"
      }`,
      30,
      185
    );

    // Lieu et date
    const today = new Date().toLocaleDateString("fr-FR");

    doc.setTextColor(0, 0, 0); // Noir
    doc.text(`Fait à ${record.contract.property.city} le ${today}`, 20, 200);

    // Signature
    doc.setFontSize(12);
    doc.text("Signature du bailleur", 20, 220);

    // Sauvegarder le PDF
    doc.save(`quittance_${record.id}.pdf`);
  };
  function numberToWords(number) {
    const units = [
      "",
      "un",
      "deux",
      "trois",
      "quatre",
      "cinq",
      "six",
      "sept",
      "huit",
      "neuf",
      "dix",
      "onze",
      "douze",
      "treize",
      "quatorze",
      "quinze",
      "seize",
      "dix-sept",
      "dix-huit",
      "dix-neuf",
    ];
    const tens = [
      "",
      "",
      "vingt",
      "trente",
      "quarante",
      "cinquante",
      "soixante",
      "soixante-dix",
      "quatre-vingt",
      "quatre-vingt-dix",
    ];

    function convertLessThanOneThousand(n) {
      if (n === 0) return "";

      let result = "";

      if (n >= 100) {
        result +=
          units[Math.floor(n / 100)] + (n >= 200 ? " cent" : " cents") + " ";
        n %= 100;
      }

      if (n >= 20) {
        const tenIndex = Math.floor(n / 10);
        result += tens[tenIndex];
        if (n % 10 === 1 && tenIndex !== 8) result += " et";
        result += " ";
        n %= 10;
      }

      if (n > 0) {
        if (n <= 19) {
          result += units[n];
        } else {
          result += units[n];
        }
      }

      return result.trim();
    }

    if (number === 0) return "zéro";

    let result = "";
    let billions = Math.floor(number / 1000000000);
    let millions = Math.floor((number % 1000000000) / 1000000);
    let thousands = Math.floor((number % 1000000) / 1000);
    let remainder = number % 1000;

    if (billions > 0) {
      result +=
        convertLessThanOneThousand(billions) +
        " milliard" +
        (billions > 1 ? "s" : "") +
        " ";
    }

    if (millions > 0) {
      result +=
        convertLessThanOneThousand(millions) +
        " million" +
        (millions > 1 ? "s" : "") +
        " ";
    }

    if (thousands > 0) {
      result += convertLessThanOneThousand(thousands) + " mille ";
    }

    if (remainder > 0) {
      result += convertLessThanOneThousand(remainder);
    }

    return result.trim();
  }
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/rental-payments/${id}`)
      .then(() => {
        setRentalRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== id)
        );
        setSnackbarOpen(true);
      })
      .catch(() => {
        setError("Failed to delete rental record.");
        setSnackbarOpen(true);
      });
  };

  const handleEdit = (id) => {
    window.location.href = `/rentalrecords/edit/${id}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    axios
      .patch(`http://localhost:3001/rentalrecords/${id}`, {
        paymentStatus: newStatus,
      })
      .then(() => {
        setRentalRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id ? { ...record, paymentStatus: newStatus } : record
          )
        );
        setSnackbarOpen(true);
      })
      .catch(() => {
        setError("Failed to update rental record status.");
        setSnackbarOpen(true);
      });
  };

  const filteredRecords = rentalRecords.filter(
    (record) =>
      (record.contract.tenant.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        record.contract.property.propertyNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(record.paymentStatus))
  );

  const handleStatusFilterChange = (status) => {
    setStatusFilter((prevFilter) =>
      prevFilter.includes(status)
        ? prevFilter.filter((s) => s !== status)
        : [...prevFilter, status]
    );
  };
  const statusStyles = {
    PENDING: { color: "#FFA500", backgroundColor: "#FFF5E6" },
    PAID: { color: "#4CAF50", backgroundColor: "#E8F5E9" },
    PARTIAL: { color: "#2196F3", backgroundColor: "#E3F2FD" },
    LATE: { color: "#F44336", backgroundColor: "#FFEBEE" },
    DEFAULT: { color: "#757575", backgroundColor: "#F5F5F5" },
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        color="primary"
        sx={{ mb: 4 }}
      >
        Rental Records
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
            {["PENDING", "PAID", "PARTIAL", "LATE"].map((status) => (
              <Chip
                key={status}
                label={status}
                onClick={() => handleStatusFilterChange(status)}
                color={statusFilter.includes(status) ? "primary" : "default"}
                variant={statusFilter.includes(status) ? "filled" : "outlined"}
              />
            ))}
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="rental records table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Property</StyledTableCell>
                  <StyledTableCell>Tenant</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell align="right">Amount Due</StyledTableCell>
                  <StyledTableCell align="right">Amount Paid</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords.map((record) => (
                  <StyledTableRow key={record.id}>
                    <TableCell>
                      {record.contract.property.propertyNumber}
                    </TableCell>
                    <TableCell>{record.contract.tenant.name}</TableCell>
                    <TableCell>
                      {new Date(record.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {record.amountDue.toFixed(2)} MAD
                    </TableCell>
                    <TableCell align="right">
                      {record.amountPaid.toFixed(2)} MAD
                    </TableCell>
                    <TableCell
                      style={
                        statusStyles[record.paymentStatus] ||
                        statusStyles.DEFAULT
                      }
                    >
                      {record.paymentStatus}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(record.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {/* <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(record.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Télécharger la quittance">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => generateRentReceipt(record)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Add New Record">
          <Button
            variant="contained"
            color="primary"
            href="/rentalrecords/add"
            startIcon={<AddIcon />}
            size="large"
            sx={{
              borderRadius: 28,
              boxShadow: (theme) => theme.shadows[4],
              "&:hover": {
                boxShadow: (theme) => theme.shadows[8],
              },
            }}
          >
            Add Record
          </Button>
        </Tooltip>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error || "Operation successful"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RentalRecords;
