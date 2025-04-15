import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Box, Snackbar, Alert, CircularProgress } from "@mui/material";
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

  const handleResolved = async (patientAddress) => {
    try {
      setLoading(true);
      const tx = await contract.markAppointmentDoneByDoctor(patientAddress);
      const txReceipt = await tx.wait();
      const txHash = txReceipt.transactionHash;

      await delay(3000);
      const hashscanLink = `https://hashscan.io/testnet/transaction/${txHash}`;

      setSnackbar({
        open: true,
        severity: "success",
        message: (
          <>
            Appointment resolved ✅ |{" "}
            <a
              href={hashscanLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              View Txn
            </a>
          </>
        ),
      });

      // Refresh the patient list
      const updated = await contract.getPatientsOfDoctor(account);
      setPatients(updated);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to resolve appointment.",
      });
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor's Appointments
      </Typography>

      {patients.length === 0 && (
        <Typography variant="body1">No appointments assigned yet.</Typography>
      )}

      {patients.map((patient, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Patient Address: {patient}</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  navigate("/add", {
                    state: {
                      contract,
                      account,
                      role,
                      selectedPatientAddress: patient,
                    },
                  })
                }
              >
                Add New Record
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  navigate("/view-health-records", {
                    state: {
                      contract,
                      account: patient,
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
                onClick={() => handleResolved(patient)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Resolved"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

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
