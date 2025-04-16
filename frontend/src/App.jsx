import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Snackbar,
  Alert,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ProfileOverlay from "./components/ProfileOverlay";

import Dashboard from "./components/Dashboard";
import AddHealthRecord from "./pages/AddHealthRecord";
import ViewHealthRecords from "./pages/ViewHealthRecords";
import BookAppointment from "./pages/BookAppointment";
import RegisterDoctor from "./pages/RegisterDoctor";

import { ContractAddress } from './config';
import HealthRecordManagement from "./abis/HealthRecordManagement.json";
import darkTheme from "./theme";
import Layout from "./layout/Layout";
import ViewDoctor from "./pages/ViewDoctor";
import PatientViewAppointment from "./pages/PatientViewAppointment";
import DoctorViewAppointment from "./pages/DoctorViewAppointment";

const App = () => {
  const [state, setState] = useState({ provider: null, signer: null, contract: null });
  const [account, setAccount] = useState("");
  const [role, setRole] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showProfile, setShowProfile] = useState(false);

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return showMessage("Please install MetaMask", "error");

      const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];

      ethereum.on("chainChanged", () => window.location.reload());
      ethereum.on("accountsChanged", () => window.location.reload());

      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        ContractAddress,
        HealthRecordManagement.abi,
        signer
      );

      let userRole = "USER";
      const isOwner = await contractInstance.isOwner(userAddress);
      if (isOwner) {
        userRole = "OWNER";
      } else if (await contractInstance.isAuthorizedDoctor(userAddress)) {
        userRole = "DOCTOR";
      }

      setState({ provider, signer, contract: contractInstance });
      setAccount(userAddress);
      setRole(userRole);
      showMessage("Wallet connected successfully!");
    } catch (err) {
      console.error(err);
      showMessage(err.message || "Wallet connection failed", "error");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar role={role} onProfileClick={() => setShowProfile(true)} />
        {!account ? (
          <LandingPage connectWallet={connectWallet} />
        ) : (
          <>
            <ProfileOverlay
              open={showProfile}
              onClose={() => setShowProfile(false)}
              address={account}
              role={role}
            />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard role={role} />} />
                {(role === "OWNER") && (
                  <>
                  <Route path="/register-doctor" element={<RegisterDoctor contract={state.contract} account={account} role={role} />} />
                  <Route path="/view-doctor" element={<ViewDoctor contract={state.contract} account={account} role={role} />} />
                  </>
                )}

                {(role === "USER") && (
                  <>
                  <Route path="/add-health-record" element={<AddHealthRecord contract={state.contract} account={account} role={role}  />} />
                  <Route path="/view-health-records" element={<ViewHealthRecords contract={state.contract} account={account} role={role} />} />
                  <Route path="/book-appointments" element={<BookAppointment contract={state.contract} account={account} role={role} />} />
                  <Route path="/patient-view-appointments" element={<PatientViewAppointment contract={state.contract} account={account} role={role} />} />
                  </>
                )}

                {(role === "DOCTOR") && (
                  <>
                  <Route path="/add-health-record" element={<AddHealthRecord contract={state.contract} account={account} role={role} />} />
                  <Route path="/view-health-records" element={<ViewHealthRecords contract={state.contract} account={account} role={role} />} />
                  <Route path="/book-appointments" element={<BookAppointment contract={state.contract} account={account} role={role} />} />
                  <Route path="/patient-view-appointments" element={<PatientViewAppointment contract={state.contract} account={account} role={role} />} />
                  <Route path="/doctor-view-appointments" element={<DoctorViewAppointment contract={state.contract} account={account} role={role} />} />
                  </>
                )}
              </Route>
            </Routes>
          </>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Router>
    </ThemeProvider>
  );
};

export default App;
