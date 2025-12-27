import { useEffect, useState } from "react";
import "./StartScreen.css";
import logo from "./images/logo.png";


const API_BASE = process.env.REACT_APP_RPI_API_BASE_URL;

export default function StartScreen({ onStart }) {
  const [data, setData] = useState(null);
  const [showModeButtons, setShowModeButtons] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/all-data`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="start-screen">
      <div className="add-container">
        <div className="overlay"></div>
        <div className="content-wrapper">
          <img src={logo} alt="logo" className="logo" />
          <h2 className="title">Smart Water Dispenser</h2>
          <p className="subtitle">Pure. Fresh. Affordable.</p>
        </div>
      </div>
      <div className="main-container">
        <div className="card">
          <h2>Live Sensor Data</h2>
          <div className="grid">
            <div className="item">
              <div className="label">Temperature (C)</div>
               <div className="value">
                {data ? data.temperature : "--"}
              </div>
            </div>
            <div className="item">
              <div className="label">pH Value</div>
              <div className="value" id="ph">
                 {data ? data.sensors.ph : "--"}
              </div>
            </div>
            <div className="item">
              <div className="label">TDS (ppm)</div>
              <div className="value" id="tds">
                {data ? data.sensors.tds.toFixed(2) : "--"}
              </div>
            </div>
            <div className="item">
              <div className="label">Turbidity (NTU)</div>
              <div className="value" id="turbidity">
                {data ? data.sensors.turbidity : "--"}
              </div>
            </div>
          </div>
        </div>

        <div className="card ">
          {
            !showModeButtons ? (
              <>
              <h2>Select Language</h2>
              <button className="btn-green" onClick={() => setShowModeButtons(true)}>English</button><br/>
              <button className="btn-green" onClick={() => setShowModeButtons(true)}>Hindi</button><br/>
              <button className="btn-green" onClick={() => setShowModeButtons(true)}>Marathi</button><br/>
            </>
            ) : (
              <>
              <h2>Select Login Mode</h2>
              <button className="btn-green" onClick={() => onStart && onStart('with-qr')}>With QR</button><br/>
              <button className="btn-green" onClick={() => onStart && onStart('without-qr')}>Without QR</button><br/>
            </>
            )
                
          }
          
        </div>
      </div>
    </div>
  );
}