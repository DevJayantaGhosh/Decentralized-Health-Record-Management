// src/pages/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Link,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

const BookAppointment = ({ contract, account }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const doctors = await contract.getAllDoctors();
      setRecords(doctors);
    } catch (err) {
      console.error("Error loading doctors:", err);
      setError("Failed to load doctor records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchRecords();
    }
  }, [contract, account]);

  const shortenAddress = (addr) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleOpenDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setReason("");
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !reason.trim()) return;
    try {
      setSubmitting(true);

      const tx = await contract.bookAppointment(
        selectedDoctor.doctorAddress,
        reason
      );
      await tx.wait();

      setSnackbar({
        open: true,
        message: "Appointment booked successfully!",
        severity: "success",
      });
      handleDialogClose();
    } catch (err) {
      console.error("Booking failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to book appointment.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Book Appointment
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : records.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No doctor records found.
        </Typography>
      ) : (
        <Grid container spacing={3} mt={3} justifyContent="center">
          {records.map((record, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Doctor</Typography>
                    <Chip
                      label={record.status ? "Active" : "Inactive"}
                      color={record.status ? "success" : "error"}
                      icon={record.status ? <CheckCircleOutlineIcon /> : <CancelIcon />}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Grid>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Address:</strong> {record.doctorAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Qualification:</strong> {record.qualification}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Specialization:</strong> {record.specialization}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {record.timeStamp.toString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Added By:</strong>{" "}
                    <Link
                      href={`https://hashscan.io/testnet/account/${record.addedBy}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      color="secondary"
                    >
                      {shortenAddress(record.addedBy)}
                    </Link>
                  </Typography>
//record.doctorAddress.toLowerCase() !== account.toLowerCase()
                  {record.status && (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => handleOpenDialog(record)}
                    >
                      Book Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Appointment Reason Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Book Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for appointment"
            fullWidth
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBookAppointment}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookAppointment;
