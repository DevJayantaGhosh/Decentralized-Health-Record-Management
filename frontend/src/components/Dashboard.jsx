// src/pages/Dashboard.jsx
import React from "react";
import {
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ role }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const actions = {
    OWNER: [
      { label: "Register Doctor", path: "/register-doctor" },
      { label: "View Doctor", path: "/view-doctor" },
    ],
    USER: [
      { label: "Add Health Record", path: "/add-health-record" },
      { label: "View Health Records", path: "/view-health-records" },
      { label: "Book Appointments", path: "/book-appointments" },
      { label: "View Appointments", path: "/patient-view-appointments" },
    ],
    DOCTOR: [
      { label: "Add Health Record", path: "/add-health-record" },
      { label: "View Health Records", path: "/view-health-records" },
      { label: "Book Appointments", path: "/book-appointments" },
      { label: "View Appointments", path: "/doctor-view-appointments" },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Welcome to Health Record Chain
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={3}
        mt={4}
      >
        {(actions[role] || []).map((action, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1e1e1e",
              color: "white",
              width: 240,
              height: 140,
            }}
          >
            <CardActionArea onClick={() => handleNavigate(action.path)}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  align="center"
                >
                  {action.label}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard;
