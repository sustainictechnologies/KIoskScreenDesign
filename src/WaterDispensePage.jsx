import React from 'react';
import './WaterDispensePage.css';

const WaterDispensePage = () => {
  return (
    <div className="water-dispense-page">
      <div className="container">
        {/* "Dispensing Complete!" header from first image */}
        <div className="dispensing-header">
          Dispensing Complete!
        </div>

        {/* Main success message */}
        <div className="success-message">
          Your water has been dispensed successfully.
        </div>

        {/* Quantity and Balance sections */}
        <div className="data-section">
          <div className="data-item">
            <div className="data-label">Quantity Dispensed</div>
            <div className="data-value">500 ml</div>
          </div>

          <div className="data-item">
            <div className="data-label">Updated Balance</div>
            <div className="data-value">¥445.00</div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="transaction-summary">
          <div className="summary-title">Transaction Summary</div>

          <div className="summary-items">
            <div className="summary-item">
              <span className="item-label">Amount Dispensed:</span>
              <span className="item-value">500 ml</span>
            </div>

            <div className="summary-item">
              <span className="item-label">Cost per ml:</span>
              <span className="item-value">¥0.0100</span>
            </div>

            <div className="summary-item">
              <span className="item-label">Total Deducted:</span>
              <span className="item-value">¥5.00</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="continue-container">
          <button className="continue-button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterDispensePage;
