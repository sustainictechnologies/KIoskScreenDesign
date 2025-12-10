import React from "react";
import "./WaterDispenseConfirmation.css";

export default function WaterDispenserConfirmation({
  dispensedAmount = 500,
  costPerML = 0.01,
  updatedBalance = 445,
  onContinue,
}) {
  const totalDeducted = (dispensedAmount * costPerML).toFixed(2);

  return (
    <div className="confirm-container">
      <div className="confirm-top">
        <div className="check-circle">
          <span>✔</span>
        </div>

        <h2 className="confirm-title">Dispensing Complete!</h2>
        <p className="confirm-subtitle">
          Your water has been dispensed successfully.
        </p>
      </div>

      <div className="confirm-stats">
        <div className="stat-card">
          <p className="stat-label">Quantity Dispensed</p>
          <p className="stat-value">{dispensedAmount} ml</p>
        </div>

        <div className="stat-card">
          <p className="stat-label">Updated Balance</p>
          <p className="stat-value-green">₹{updatedBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="summary-card">
        <h3>Transaction Summary</h3>

        <div className="summary-row">
          <span>Amount Dispensed:</span>
          <span>{dispensedAmount} ml</span>
        </div>

        <div className="summary-row">
          <span>Cost per ml:</span>
          <span>₹{costPerML.toFixed(4)}</span>
        </div>

        <div className="summary-row">
          <span>Total Deducted:</span>
          <span className="deducted">₹{totalDeducted}</span>
        </div>
      </div>

      <button className="continue-btn" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}