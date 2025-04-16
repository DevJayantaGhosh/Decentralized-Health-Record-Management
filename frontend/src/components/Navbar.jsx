import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Navbar = ({ role, onProfileClick }) => {
  return (
    <AppBar position="fixed" sx={{ background: "rgba(0, 0, 0, 0.6)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="h2" sx={{ color: "white" , fontWeight: "bold" }} component={Link} to="/">
         Health Record Chain
        </Button>

        {role && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {role === "OWNER" && (
              <>
              <Button component={Link} to="/register-doctor" color="inherit"> Register-Doctor </Button>
              <Button component={Link} to="/view-doctor" color="inherit"> View-Doctor</Button></>
              
            )}
            {(role === "USER") && (
            <>
            <Button component={Link} to="/add-health-record" color="inherit">Add</Button>
            <Button component={Link} to="/view-health-records" color="inherit">View</Button>
            <Button component={Link} to="/book-appointments" color="inherit">Book-Appointments</Button>
            <Button component={Link} to="/patient-view-appointments" color="inherit">Patient-View-Appointments</Button>
            </>
            )}
            {(role === "DOCTOR") && (
              <>
              <Button component={Link} to="/add-health-record" color="inherit">Add</Button>
              <Button component={Link} to="/view-health-records" color="inherit">View</Button>
              <Button component={Link} to="/book-appointments" color="inherit">Book-Appointments</Button>
              <Button component={Link} to="/doctor-view-appointments" color="inherit">Doctor-View-Appointments</Button>
              </>
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
