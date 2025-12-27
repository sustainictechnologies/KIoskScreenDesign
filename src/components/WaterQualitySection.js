import React from "react";
import "./WaterQualitySection.css";

export default function WaterQualitySection() {
  return (
    <div className="quality-wrapper">
      {/* PH LEVEL */}
      <div className="quality-card row">
        <div className="quality-icon ph-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12C6 12 6 6 9 6C12 6 12 18 15 18C18 18 18 12 21 12"
              stroke="#0050ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="quality-label">pH Level</p>
        <h2 className="quality-value blue">7.2</h2>
      </div>

      {/* TDS LEVEL */}
      <div className="quality-card row">
        <div className="quality-icon tds-icon">
          {/* TDS Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C9 6 5 9 5 14C5 17.9 8.1 21 12 21C15.9 21 19 17.9 19 14C19 9 15 6 12 2Z"
              stroke="#00a7c4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="quality-label">TDS Level</p>
        <h2 className="quality-value aqua">145</h2>
      </div>

      {/* TURBIDITY */}
      <div className="quality-card row">
        <div className="quality-icon turbidity-icon">
          {/* Turbidity Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="#009f8b"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="3" fill="#009f8b" />
          </svg>
        </div>

        <p className="quality-label">Turbidity</p>
        <h2 className="quality-value green">0.8</h2>
      </div>
    </div>
  );
}
