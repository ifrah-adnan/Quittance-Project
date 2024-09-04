import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CardComponent = ({ item, onDelete, onEdit, fields, editLink }) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleViewImages = () => {
    setCurrentImageIndex(0);
    setImageDialogOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < item.images.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  return (
    <Card
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" component="div" color="primary.main">
            Property #{item.propertyNumber}
          </Typography>
          {item.images.length > 0 && (
            <Button
              size="small"
              color="primary"
              onClick={handleViewImages}
              variant="outlined"
              sx={{ ml: 2 }}
            >
              View Images
            </Button>
          )}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <HomeIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {item.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOnIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {`${item.address}, ${item.city}, ${item.state} ${item.zipCode}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <HouseIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {`Type: ${item.propertyType}`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          size="small"
          color="primary"
          component={Link}
          href={`${editLink}?id=${item.id}`}
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(item.id)}
          variant="outlined"
        >
          Delete
        </Button>
      </CardActions>

      {/* Dialogue d'affichage d'images */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            Images for Property #{item.propertyNumber}
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            {currentImageIndex > 0 && (
              <IconButton onClick={handlePrevImage}>
                <ArrowBackIcon />
              </IconButton>
            )}
            {item.images && item.images.length > 0 && (
              <img
                src={`http://localhost:3001/${item.images[currentImageIndex]?.url}`}
                alt={`Property Image ${currentImageIndex + 1}`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            {currentImageIndex < item.images.length - 1 && (
              <IconButton onClick={handleNextImage}>
                <ArrowForwardIcon />
              </IconButton>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CardComponent;
