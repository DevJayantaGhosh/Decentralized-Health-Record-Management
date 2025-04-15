import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const DoctorViewAppointment = ({ contract, account, role }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const doctorPatients = await contract.getPatientsOfDoctor(account);
        setPatients(doctorPatients);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };
    fetchPatients();
  }, [contract, account]);


  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Doctor's Appointments
      </Typography>

      {patients.length === 0 && (
        <Typography variant="h6" align="center" mt={4}>
          No appointments assigned yet.
        </Typography>
      )}
      <Grid container spacing={3} mt={3} justifyContent="center">
        {patients.map((patientAddress, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card>
              <CardContent>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">Patient</Typography>
                </Grid>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Address:</strong> {patientAddress}
                </Typography>

                <Box container spacing={3} mt={3} justifyContent="center">
                  <Button
                  sx={{ mt: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      navigate("/view-health-records", {
                        state: {
                          contract,
                          account: patientAddress,
                          role,
                        },
                      })
                    }
                  >
                    View Previous Records
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ ml: 1 }}
                    onClick={() =>
                      navigate("/add-health-record", {
                        state: {
                          selectedPatientAddress: patientAddress,
                        },
                      })
                      
                    }
                  >
                    Add New Record
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorViewAppointment;
