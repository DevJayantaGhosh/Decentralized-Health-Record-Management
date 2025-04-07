import React from "react";
import { Typography, Box } from "@mui/material";

const ViewRecords = ({ contract }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>View Health Records</Typography>
      <Typography variant="body1">User/provider can view records here.</Typography>
    </Box>
  );
};

export default ViewRecords;
