import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Paper,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const AddHealthRecord = ({ contract, account, role, selectedPatientAddress }) => {
  const isDoctor = role === "DOCTOR";

  const [formData, setFormData] = useState({
    patientAddress: "",
    height: "",
    weight: "",
    bloodPressure: "",
    cholesterol: "",
    diagnosis: "",
    treatment: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [successDetails, setSuccessDetails] = useState(null);

  useEffect(() => {
    if (isDoctor && selectedPatientAddress) {
      setFormData((prev) => ({ ...prev, patientAddress: selectedPatientAddress }));
    } else if (!isDoctor) {
      setFormData((prev) => ({ ...prev, patientAddress: account }));
    }
  }, [isDoctor, selectedPatientAddress, account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      patientAddress,
      height,
      weight,
      bloodPressure,
      cholesterol,
      diagnosis,
      treatment,
    } = formData;

    if (
      !patientAddress ||
      !height ||
      !weight ||
      !bloodPressure ||
      !cholesterol ||
      !diagnosis ||
      !treatment
    ) {
      return setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
    }

    try {
      setLoading(true);
      const tx = await contract.addHealthRecord(
        patientAddress,
        parseInt(height),
        parseInt(weight),
        bloodPressure,
        cholesterol,
        diagnosis,
        treatment
      );
      const txReceipt = await tx.wait();
      const txHash = txReceipt.transactionHash;

      await delay(3000);

      const hashscanLink = `https://hashscan.io/testnet/transaction/${txHash}`;

      setSuccessDetails({
        message: "Health record added successfully!",
        hash: txHash,
        link: hashscanLink,
      });

      setFormData({
        patientAddress: isDoctor && selectedPatientAddress ? selectedPatientAddress : account,
        height: "",
        weight: "",
        bloodPressure: "",
        cholesterol: "",
        diagnosis: "",
        treatment: "",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to add health record. See console for details.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Add Health Record
      </Typography>

      {successDetails ? (
        <Paper elevation={4} sx={{ p: 4, textAlign: "center", mt: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h5" mt={2} gutterBottom>
            {successDetails.message}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Transaction Hash:
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-word", mb: 2 }}>
            {successDetails.hash}
          </Typography>
          <Link
            href={successDetails.link}
            target="_blank"
            rel="noopener"
            color="primary"
            underline="hover"
          >
            View on HashScan
          </Link>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSuccessDetails(null)}
            >
              Add Another Record
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Patient Address"
            name="patientAddress"
            value={formData.patientAddress}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: !isDoctor }}
          />
          <TextField
            label="Added By"
            value={account}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Blood Pressure"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cholesterol"
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2, mb: 4 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Record"}
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddHealthRecord;
