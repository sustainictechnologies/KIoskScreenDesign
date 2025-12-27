import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import WaterQualitySection from "./WaterQualitySection";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedQuantity, setSelectedQuantity] = useState(500);
  const [customAmount, setCustomAmount] = useState("");

  const pricePerMl = 0.01;
  const quantity = customAmount ? Number(customAmount) : selectedQuantity;
  const estimatedCost = (quantity * pricePerMl).toFixed(2);

  const handleDispense = () => {
    navigate("/dispense", { state: { amount: quantity } });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, Demo User</h2>
        <button className="logout-btn" onClick={() => navigate("/")}>Log Out</button>
      </header>

      {/* Water Quality Section */}
      <h3 className="section-title">Water Quality</h3>
      <WaterQualitySection />

      {/* Select Quantity */}
      <h3 className="section-title">Select Quantity</h3>

      <div className="quantity-wrapper">
        {/* Buttons */}
        <div className="qty-options">
          <button
            className={`qty-btn ${selectedQuantity === 250 ? "active" : ""}`}
            onClick={() => {
              setSelectedQuantity(250);
              setCustomAmount("");
            }}
          >
            250 ml
          </button>

          <button
            className={`qty-btn ${selectedQuantity === 500 ? "active" : ""}`}
            onClick={() => {
              setSelectedQuantity(500);
              setCustomAmount("");
            }}
          >
            500 ml
          </button>

          <button
            className={`qty-btn ${selectedQuantity === 1000 ? "active" : ""}`}
            onClick={() => {
              setSelectedQuantity(1000);
              setCustomAmount("");
            }}
          >
            1 L
          </button>
        </div>

        {/* Custom Input */}
        <input
          className="custom-input"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
        />

        {/* Estimated Cost */}
         <div className="cost-box">
          <p>Estimated Cost: ₹{estimatedCost}</p>
        </div>

        <button className="dispense-btn" onClick={handleDispense}>Dispense Now</button>
      </div>
    </div>
  );
}
