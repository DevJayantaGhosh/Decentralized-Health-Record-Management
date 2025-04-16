import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";

const PatientViewAppointment = ({ contract, account }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointmentDetails = await contract.getAssignedDoctorsOfPatient(account);
      setAppointments(appointmentDetails);
    } catch (err) {
      console.error("Error fetching appointments", err);
      setSnackbar({ open: true, message: "Failed to fetch appointments", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const markAppointmentDone = async (doctorAddress) => {
    try {
      setLoading(true);
      const tx = await contract.markAppointmentDoneAndRevokeAccess(doctorAddress);
      const txReceipt = await tx.wait();
      const txHash = txReceipt.transactionHash;

      await delay(3000);
      const hashscanLink = `https://hashscan.io/testnet/transaction/${txHash}`;

      setSnackbar({
        open: true,
        severity: "success",
        message: (
          <>
            Appointment marked as done & revoked access! {" "}
            <a
              href={hashscanLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              View Transaction
            </a>
          </>
        ),
      });

      await fetchAppointments();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to mark appointment", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Your Booked Appointments
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No appointments found.
        </Typography>
      ) : (
        <Grid container spacing={3} mt={3} justifyContent="center">
                  {appointments.map((doctorAddress, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Grid container justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Doctor</Typography>
                          </Grid>

                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Address:</strong> {doctorAddress}
                          </Typography>
                        
                          <Button
                          variant="contained"
                          color="success"
                          onClick={() => markAppointmentDone(doctorAddress)}
                          sx={{ mt: 2 }}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={20} /> : "Revoke Access"}
                        </Button>

                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
        </Grid>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PatientViewAppointment;
