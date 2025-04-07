import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Navbar = ({ role, onProfileClick }) => {
  return (
    <AppBar position="fixed" sx={{ background: "rgba(0, 0, 0, 0.6)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "white" }}>
         MediChain
        </Typography>

        {role && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/add" color="inherit">Add</Button>
            <Button component={Link} to="/view" color="inherit">View</Button>
            {role === "USER" && (
              <Button component={Link} to="/book" color="inherit">Book-Appointments</Button>
            )}
            {role === "OWNER" && (
              <Button component={Link} to="/register-doctor" color="inherit">
                Register-Doctor
              </Button>
            )}
            {(role === "HEALTH_SERVICE_PROVIDER") && (
              <Button component={Link} to="/appointments" color="inherit">
                Doctor-Appointments
              </Button>
            )}
          </Box>
        )}

        {role && (
          <IconButton color="inherit" onClick={onProfileClick}>
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
