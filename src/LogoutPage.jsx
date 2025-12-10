import React, { useEffect, useState } from "react";
import "./LogoutPage.css";

export default function LogoutPage({ onLogout, onContinue }) {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogout(); // auto logout
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout]);

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2 className="logout-title">Transaction Complete!</h2>
        <p className="logout-subtitle">Thank you for using Smart Water ATM</p>

        <div className="timer-circle">
          <span className="timer-number">{countdown}</span>
        </div>

        <p className="auto-logout-text">Auto-logout in {countdown} seconds</p>

        <p className="need-text">Need Another Transaction?</p>
        <p className="morewater-text">Would you like to dispense more water?</p>

        <button className="continue-btn" onClick={onContinue}>
          Yes, Continue Shopping
        </button>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
        

        <p className="footer-note">
          Please remember to collect your belongings
        </p>
      </div>
    </div>
  );
}