import React from "react";
import { Typography, Box } from "@mui/material";

const AddRecord = ({ contract }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Add Health Record</Typography>
      <Typography variant="body1">Form to add health record goes here.</Typography>
    </Box>
  );
};

export default AddRecord;
