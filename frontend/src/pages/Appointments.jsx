import React from "react";
import { Typography, Box } from "@mui/material";

const Appointments = ({ contract }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Appointments</Typography>
      <Typography variant="body1">See or manage appointments here.</Typography>
    </Box>
  );
};

export default Appointments;
