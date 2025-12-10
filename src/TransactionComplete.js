import React, { useEffect, useState } from "react";
import "./TransactionComplete.css";
import { useNavigate } from "react-router-dom";

export default function TransactionComplete({
  dispensed = 1200,
  costPerML = 0.01,
  balanceBefore = 450
}) {
  const navigate = useNavigate();
  const totalCost = dispensed * costPerML;
  const updatedBalance = balanceBefore - totalCost;

  const [count, setCount] = useState(10); // countdown starts from 10 sec

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="transaction-wrapper">
      <h1>Transaction Complete!</h1>
      <p>Thank you for using Smart Water ATM</p>

      <div className="transaction-card">
        <div className="count-circle">{count}</div>
        <div className="auto-text">Auto-logout in {count} seconds</div>

        <div className="summary-title">Transaction Summary</div>
        <div className="summary-sub">Your dispensing details are below</div>
        <div className="separater-line"></div>

        <div className="summary-row">
          <span>Amount Dispensed:</span>
          <span className="value">{dispensed} ml</span>
        </div>

        <div className="summary-row">
          <span>Cost per ml:</span>
          <span className="value">₹{costPerML.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Total Deducted:</span>
          <span className="value">₹{totalCost.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Updated Balance:</span>
          <span className="value">₹{updatedBalance.toFixed(2)}</span>
        </div>

        <button
          className="action-btn"
          onClick={() => navigate("/qr")}
        >
          Yes, Continue Shopping
        </button>

        <button
          className="logout-btn"
          onClick={() => navigate("/")}
        >
          No, Logout Now
        </button>

        <div className="remember">
          Please remember to collect your belongings
        </div>
      </div>
    </div>
  );
}
