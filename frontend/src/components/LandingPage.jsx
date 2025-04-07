import React from "react";
import { Button, Typography, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const LandingPage = ({ connectWallet }) => (
  <Box
    sx={{
      pt: 8,
      height: "100vh",
      backgroundImage: `url("/background.png")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
    }}
  >
    <Typography variant="h3" gutterBottom>
      Welcome to MediChain
    </Typography>
    <Typography variant="h4" gutterBottom>
      Decentralized Health Records Management System
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<AccountBalanceWalletIcon />}
      onClick={connectWallet}
    >
      Connect Wallet
    </Button>
  </Box>
);

export default LandingPage;
