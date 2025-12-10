import React, { useState, useMemo } from 'react';
import '../styles/AdminDashboard.css';

function QuantitySelector({ costPerMl = 0.01, presetSelected = 500, onDispense }) {
  const presets = [250, 500, 1000];
  const [selectedPreset, setSelectedPreset] = useState(presetSelected);
  const [customMl, setCustomMl] = useState('');

  const activeMl = useMemo(() => {
    if (customMl.trim()) {
      const parsed = parseInt(customMl, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }
    return selectedPreset;
  }, [customMl, selectedPreset]);

  const estimatedCost = useMemo(() => {
    return parseFloat((activeMl * costPerMl).toFixed(2));
  }, [activeMl, costPerMl]);

  const handlePresetClick = (ml) => {
    setSelectedPreset(ml);
    setCustomMl('');
  };

  const handleDispense = () => {
    if (activeMl > 0) {
      onDispense?.(activeMl, estimatedCost);
    }
  };

  return (
    <div className="quantity-root">
      <h2 className="card-title">Select Quantity</h2>

      <div className="preset-row">
        {presets.map((ml) => (
          <button
            key={ml}
            className={`preset-btn ${selectedPreset === ml && !customMl ? 'active' : ''}`}
            onClick={() => handlePresetClick(ml)}
          >
            {ml === 1000 ? '1 L' : `${ml} ml`}
          </button>
        ))}
      </div>

      <div className="custom-field">
        <label className="custom-label">Custom Quantity (ml)</label>
        <input
          className="custom-input"
          type="number"
          min={0}
          placeholder="Enter custom amount"
          value={customMl}
          onChange={(e) => setCustomMl(e.target.value)}
        />
      </div>

      <div className="cost-row">
        <span className="cost-label">Estimated Cost:</span>
        <span className="cost-value">₹{estimatedCost.toFixed(2)}</span>
      </div>

      <button
        className="primary-btn"
        onClick={handleDispense}
        disabled={activeMl <= 0}
      >
        Dispense Now
      </button>
    </div>
  );
}

export default QuantitySelector;
