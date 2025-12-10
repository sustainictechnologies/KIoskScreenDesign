import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DispenseComplete.css';

const DispenseComplete = ({ dispensed, costPerML, balanceBefore }) => {
  const navigate = useNavigate();
  const cost = dispensed * costPerML;
  const newBalance = balanceBefore - cost;

  return (
    <div className="dispense-complete-page">
      <div className="success-icon-container">
        <div className="success-icon">✅</div>
      </div>
      <h1 className="main-title">Dispense Complete</h1>
      <p className="subtitle">Your water has been dispensed successfully!</p>

      <div className="info-container">
        <div className="info-card">
          <div className="info-label">Dispensed</div>
          <div className="info-value">{dispensed} ml</div>
        </div>
        <div className="info-card">
          <div className="info-label">New Balance</div>
          <div className="info-value balance-value">₹{newBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="summary-box">
        <h3 className="summary-title">Transaction Summary</h3>
        <div className="summary-row">
          <span>Amount Dispensed</span>
          <span>{dispensed} ml</span>
        </div>
        <div className="summary-row">
          <span>Cost</span>
          <span className="summary-value-red">₹{cost.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Previous Balance</span>
          <span>₹{balanceBefore.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>New Balance</span>
          <span>₹{newBalance.toFixed(2)}</span>
        </div>
      </div>

      <button className="continue-btn" onClick={() => navigate('/')}>
        Done
      </button>
    </div>
  );
};

export default DispenseComplete;
