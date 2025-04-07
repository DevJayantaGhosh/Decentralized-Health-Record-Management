import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box sx={{ pt: 8, px: 2 }}>
      <Outlet />
    </Box>
  );
};

export default Layout;
