import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const doctorAddresses = await contract.getDoctorsForPatient(account);
      const appointmentDetails = await Promise.all(
        doctorAddresses.map(async (doctorAddress) => {
          const doctor = await contract.getDoctor(doctorAddress);
          return {
            address: doctorAddress,
            qualification: doctor.qualification,
            specialization: doctor.specialization,
            fees: doctor.fees.toString(),
          };
        })
      );
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
      const tx = await contract.markAppointmentDoneByPatient(doctorAddress);
      await tx.wait();
      setSnackbar({ open: true, message: "Appointment marked as done!", severity: "success" });
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
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
        <Grid container spacing={3} mt={2}>
          {appointments.map((doctor, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Doctor Address:
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {doctor.address}
                </Typography>

                <Typography mt={1}>Qualification: {doctor.qualification}</Typography>
                <Typography>Specialization: {doctor.specialization}</Typography>
                <Typography>Fees: {doctor.fees} Wei</Typography>

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => markAppointmentDone(doctor.address)}
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : "Mark as Done"}
                </Button>
              </Paper>
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
