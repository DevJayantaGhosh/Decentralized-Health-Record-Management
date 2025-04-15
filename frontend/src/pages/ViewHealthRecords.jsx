// src/pages/ViewHealthRecords.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Link,
  Stack,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useLocation } from "react-router-dom";
const ViewHealthRecords = ({ contract, account }) => {
  const location = useLocation()
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError("");

        const selectedPatientAddress = location.state?.selectedPatientAddress || account;

        const userAddress =
          typeof selectedPatientAddress === "object" && selectedPatientAddress.address
            ? selectedPatientAddress.address
            : selectedPatientAddress?.toString();

        if (!userAddress) throw new Error("User address not available.");

        const myRecords = await contract.viewHealthRecords(userAddress);
        setRecords(myRecords);
      } catch (err) {
        console.error("Error loading records:", err);
        setError("Failed to load health records.");
      } finally {
        setLoading(false);
      }
    };

    if (contract && account) {
      fetchRecords();
    }
  }, [contract, account]);

  const shortenAddress = (addr) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Health Records
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : records.length === 0 ? (
        <Typography variant="h6" align="center" mt={4}>
          No health records found.
        </Typography>
      ) : (
        <Stack spacing={2} alignItems="center">
          {records.map((record, index) => (
            <React.Fragment key={index}>
              <Card
                sx={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 2,
                  boxShadow: 3,
                  width: "100%",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Record #{index + 1}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Patient Address:</strong>{" "}
                    {record.patientAddress.toString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Height:</strong> {record.height.toString()} cm
                  </Typography>
                  <Typography variant="body2">
                    <strong>Weight:</strong> {record.weight.toString()} kg
                  </Typography>
                  <Typography variant="body2">
                    <strong>Blood Pressure:</strong> {record.bloodPressure}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cholesterol:</strong> {record.cholesterol}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Diagnosis:</strong> {record.diagnosis}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Treatment:</strong> {record.treatment}
                  </Typography>
                  <Typography variant="body2">
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
                </CardContent>
              </Card>

              {index !== records.length - 1 && (
                <ArrowDownwardIcon sx={{ color: "#888" }} />
              )}
            </React.Fragment>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ViewHealthRecords;
