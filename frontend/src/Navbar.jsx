import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const Navbar = ({ account, connectWallet, role }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Health DApp</Typography>
        {account ? (
          <Box display="flex" gap={2}>
            <Button component={Link} to="/view" color="inherit">View</Button>
            <Button component={Link} to="/add" color="inherit">Add</Button>
            {role === "USER" && (
              <Button component={Link} to="/book" color="inherit">Book Appointment</Button>
            )}
            {role === "HEALTH_SERVICE_PROVIDER" && (
              <Button component={Link} to="/appointments" color="inherit">Appointments</Button>
            )}
            {role === "OWNER" && (
              <Button component={Link} to="/register" color="inherit">Register Provider</Button>
            )}
            <IconButton color="inherit"><AccountCircle /></IconButton>
          </Box>
        ) : (
          <Button color="inherit" onClick={connectWallet}>Connect Wallet</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
