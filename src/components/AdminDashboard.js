import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import WaterQualitySection from "./WaterQualitySection";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(500);
  const [customAmount, setCustomAmount] = useState("");

  const pricePerMl = 0.01;
  const quantity = customAmount ? Number(customAmount) : selectedQuantity;
  const estimatedCost = (quantity * pricePerMl).toFixed(2);
  const API_BASE = process.env.REACT_APP_RPI_API_BASE_URL;

  useEffect(() => {
      fetch(`${API_BASE}/getUserDetails`)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error(err));
    }, []);

  const handleDispense = async () => {
    ///navigate("/dispense", { state: { amount: quantity } });
    console.log("handle dispensing called")
    if (quantity > 0) {
      try {
        const response = await fetch(`${API_BASE}/dispense`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ml: quantity,
          }),
        });

        if (!response.ok) {
          throw new Error("Dispense API failed");
        }

        const data = await response.json();

        // Call existing callback after successful API call
        //onDispense?.(activeMl, estimatedCost);
        navigate("/complete");
        console.log("Dispense success:", data);
      } catch (error) {
        console.error("Error dispensing:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {data ? data.firstName : "--"}</h2>
        <button className="logout-btn" onClick={() => navigate("/")}>Log Out</button>
      </header>

      {/* Water Quality Section */}
      <h3 className="section-title">Water Quality</h3>
      <WaterQualitySection  data = {data}/>


      {/* Select Quantity */}
      <h3 className="section-title">Age : {data ? data.Age : "--"}</h3>
      <h3 className="section-title">Wallet balance : {data ? data.wallateBalance: "--"}</h3>
      <h3 className="section-title">City : {data ? data.City: "--"}</h3>


      <h3 className="section-title" style={{ textAlign: "center" }}>Select Quantity</h3>

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
