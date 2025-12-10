import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import StartScreen from "./StartScreen";
import QRBarcodeScanner from "./QRBarcodeScanner";
import AuthenticationScreen from "./AuthenticationScreen";
import AuthenticationSuccess from "./AuthenticationSuccess";
import AdminDashboard from "./components/AdminDashboard";
import DispensingScreen from "./components/DispensingScreen";
import DispenseComplete from "./DispenseComplete";
import TransactionComplete from "./TransactionComplete";
import WaterDispenseConfirmation from "./WaterDispenseConfirmation";
import WaterDispensePage from "./WaterDispensePage";
import LogoutPage from "./LogoutPage";

import "./qr-scanner.css";
import "./authentication.css";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<StartScreen onStart={() => navigate("/qr")} />} />
      <Route path="/qr" element={<QRBarcodeScanner />} />
      <Route path="/auth" element={<AuthenticationScreen />} />
      <Route path="/success" element={<AuthenticationSuccess />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dispense" element={<DispensingScreen />} />
      
      {/* Dispense complete screen */}
      <Route
        path="/complete"
        element={<DispenseComplete dispensed={500} costPerML={0.01} balanceBefore={450} />}
      />

      {/* Transaction complete screen */}
      <Route
        path="/transaction-complete"
        element={
          <TransactionComplete
            dispensed={1200}
            costPerML={0.01}
            balanceBefore={500}
          />
        }
      />

      {/* Water dispense confirmation screen */}
      <Route 
        path="/confirmation" 
        element={<WaterDispenseConfirmation onContinue={() => navigate("/logout")} />} 
      />
      
      {/* Logout page screen */}
      <Route 
        path="/logout" 
        element={<LogoutPage onLogout={() => navigate("/")} onContinue={() => navigate("/admin")} />} 
      />
    </Routes>
  );
}

export default App;
