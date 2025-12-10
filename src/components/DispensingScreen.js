import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DispensingScreen.css";

export default function DispensingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 1000;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const timer = setInterval(() => {
      value += 1;
      setProgress(value);

      if (value === 100) {
        clearInterval(timer);

        setTimeout(() => {
          navigate("/confirmation");
        }, 1000);
      }
    }, 60);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="dispense-wrapper">
      <h2 className="title">Dispensing Water</h2>
      <p className="subtitle">Please wait while we dispense {amount} ml</p>

      {/* Tank */}
      <div className="tank-container">
        <div
          className="water-fill"
          style={{ height: `${progress}%` }}
        ></div>
        <img src="/images/logo.png" alt="water" className="water-icon" />
      </div>

      {/* Progress section */}
      <div className="progress-section">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>

      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="footer-text">Dispensing in progress...</p>
    </div>
  );
}
