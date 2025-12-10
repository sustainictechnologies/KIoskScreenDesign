import React from "react";
import "./StartScreen.css";
import logo from "./images/logo.png";

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="overlay"></div>

      <div className="content-wrapper">
        <img src={logo} alt="logo" className="logo" />

        <h2 className="title">Smart Water Dispenser</h2>
        <p className="subtitle">Pure. Fresh. Affordable.</p>

        <button className="start-btn" onClick={onStart}>
          Start
        </button>

        <p className="hint">Touch "Start" to begin</p>
      </div>
    </div>
  );
}