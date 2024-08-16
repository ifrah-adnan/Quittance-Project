import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

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
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { styled } from "@mui/material/styles";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "jspdf-autotable";
import { useAuth } from "../../AuthContext";
const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const Contracts = ({ searchQuery }) => {
  const [contracts, setContracts] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchContracts();
    fetchTenants();
    fetchProperties();
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

  const fetchTenants = () => {
    axios
      .get("http://localhost:3001/tenants")
      .then((response) => setTenants(response.data))
      .catch(() => setError("Error fetching tenants"));
  };

  const fetchProperties = () => {
    if (!user) {
      setError("User is not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:3001/properties", {
        params: { userId: user.id },
      })
      .then((response) => setProperties(response.data))
      .catch(() => setError("Error fetching properties"))
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

  // Fonction pour obtenir le nom du locataire basé sur l'ID
  const getTenantName = (tenantId) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant ? tenant.name : "Unknown";
  };

  // Fonction pour obtenir le nom de la propriété basé sur l'ID
  const getPropertyAddress = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.propertyNumber : "Unknown";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const filteredContract = contracts.filter(
    (record) =>
      (record.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.property.propertyNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(record.paymentStatus))
  );
  const handleDownloadPDF = (contract) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Fonction pour centrer le texte
    const centerText = (text, y) => {
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Titre du document
    doc.setFontSize(24);
    doc.setTextColor(0, 87, 183); // Bleu
    centerText("QUITTANCEDELOYER", 20);

    // Fonction pour ajouter du texte avec un style spécifique
    const addText = (
      text,
      x,
      y,
      fontSize = 10,
      color = [0, 0, 0],
      isBold = false
    ) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      isBold
        ? doc.setFont("helvetica", "bold")
        : doc.setFont("helvetica", "normal");
      doc.text(text, x, y);
    };

    // Référence
    addText(
      `REF : QL ${contract.id.slice(0, 8)}-${contract.id.slice(-4)}`,
      14,
      35,
      11,
      [0, 87, 183],
      true
    );

    // Quittance de loyer du mois
    const startDate = new Date(contract.startDate);
    addText(
      `Quittance de loyer du mois de ${startDate.toLocaleString("fr-FR", {
        month: "long",
        year: "numeric",
      })}`,
      14,
      45,
      11,
      [0, 87, 183],
      true
    );

    // Adresse du bien
    const property = contract.property;
    addText(`Adresse du bien : ${property.name}`, 14, 55);
    addText(`Code postal : ${property.zipCode}`, 14, 60);
    addText(`Ville : ${property.city}`, 14, 65);
    addText(`Titre foncier : ${property.propertyNumber}`, 14, 70);

    // Déclarant
    const tenant = contract.tenant;
    addText("Déclarant :", 14, 80, 11, [0, 87, 183], true);
    addText(
      `Je soussigné(e) ${tenant.name}, ${
        tenant.tenantType === "PERSON" ? "personne physique" : "société"
      }`,
      14,
      90
    );
    addText(`Déclare avoir reçu de :`, 14, 100);
    addText(
      `La société ${tenant.name}, siège social ${tenant.address}`,
      14,
      105
    );
    addText(
      `représentée par son gérant M. ${tenant.contactName}, titulaire de la CIN N° ${tenant.contactCin}`,
      14,
      110
    );

    // Somme
    addText("La somme de :", 14, 125, 11, [0, 87, 183], true);
    addText(
      `${numberToWords(contract.rentAmount)} dirhams (${
        contract.rentAmount
      } DHS),`,
      14,
      135
    );

    // Au titre de
    addText("Au titre de :", 14, 150, 11, [0, 87, 183], true);
    addText(
      `Paiement du loyer pour la période de location du ${new Date(
        contract.startDate
      ).toLocaleDateString("fr-FR")} au ${new Date(
        contract.endDate
      ).toLocaleDateString("fr-FR")} : ${contract.rentAmount} DHS`,
      14,
      160
    );

    // Détail du règlement
    addText("DÉTAIL DU RÈGLEMENT :", 14, 175, 11, [0, 87, 183], true);
    addText(`Loyer               : ${contract.rentAmount} Dirhams`, 14, 185);
    addText(`Provision pour charges : 0,00 Dirhams`, 14, 190);
    addText(`Total               : ${contract.rentAmount} Dirhams`, 14, 195);
    addText(
      `Date du paiement    : ${new Date().toLocaleDateString("fr-FR")}`,
      14,
      200
    );

    // Signature
    addText(
      `Fait à : ${property.city} le ${new Date().toLocaleDateString("fr-FR")}`,
      14,
      220
    );
    addText("Signature du bailleur", 14, 235);

    // Génération du PDF
    doc.save(`QuittanceLoyer_${contract.id.slice(0, 8)}.pdf`);
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  }));
  console.log("this is data ", contracts);

  return (
    <Box>
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
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="Contract">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Tenant Name
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Property Number
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Start Date
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                End Date
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Rent Amount
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Terms
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: "bold" }}>
                Actions
              </StyledTableCell>
            </TableRow>{" "}
          </TableHead>
          <TableBody>
            {filteredContract.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{getTenantName(contract.tenantId)}</TableCell>
                <TableCell>{getPropertyAddress(contract.propertyId)}</TableCell>
                <TableCell>{formatDate(contract.startDate)}</TableCell>
                <TableCell>{formatDate(contract.endDate)}</TableCell>
                <TableCell>{contract.rentAmount}</TableCell>
                <TableCell>{contract.terms}</TableCell>
                <TableCell>
                  <StyledButton
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteContract(contract)}
                  >
                    Delete
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    href={`/contracts/edit?id=${contract.id}`}
                  >
                    Edit
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleDownloadPDF(contract)}
                  >
                    PDF
                  </StyledButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Add New Contract">
          <Button
            variant="contained"
            color="primary"
            href="/contracts/add"
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
            Add Contract
          </Button>
        </Tooltip>
      </Box>

      {showDeleteConfirmation && (
        <Dialog
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the contract with ID "
              {contractToDelete?.id}"?
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
    </Box>
  );
};

export default Contracts;
