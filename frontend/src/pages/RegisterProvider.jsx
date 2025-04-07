import React from "react";
import { Typography, Box } from "@mui/material";

const RegisterProvider = ({ contract }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Register Doctor</Typography>
      <Typography variant="body1">Owner can register doctors here.</Typography>
    </Box>
  );
};

export default RegisterProvider;
