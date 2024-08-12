import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HouseIcon from "@mui/icons-material/House";

const CardComponent = ({ item, onDelete, onEdit, fields, editLink }) => {
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
    </Card>
  );
};

export default CardComponent;
