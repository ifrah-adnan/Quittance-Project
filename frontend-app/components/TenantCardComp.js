import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const TenantCardComponent = ({ item, onDelete, onEdit, fields, editLink }) => {
  return (
    <Card
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="div">
            {item.name}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOnIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {item.address}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {item.contactInfo}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon
                sx={{ mr: 1, color: "text.secondary", fontSize: "small" }}
              />
              <Typography variant="body2" color="text.secondary">
                {item.contactCin}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Chip
              label={`Type: ${item.tenantType}`}
              size="small"
              color="primary"
              variant="outlined"
            />
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

export default TenantCardComponent;
