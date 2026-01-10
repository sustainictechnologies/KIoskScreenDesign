import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_RPI_API_BASE_URL;

const CameraScanner = () => {
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const scanningRef = useRef(true);
    const navigate = useNavigate();
    useEffect(() => {
        let intervalId;
        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_BASE}/qr/status`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) return;

                const data = await response.json();

                // Expected: { user: null, verified: true }
                if (data?.verified === true) {
                    scanningRef.current = false;
                    clearInterval(intervalId);
                    navigate("/admin");
                }
            } catch (error) {
                console.error("Status check failed:", error);
            }
        };

          // poll every 2 seconds
        intervalId = setInterval(checkStatus, 2000);

        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Scan Barcode / QR Code</h2>
            <img
                ref={imgRef}
                src={process.env.REACT_APP_STREAM_URL}
                alt="Camera Stream"
                style={{ width: "100%", maxWidth: "400px" }}
                crossOrigin="anonymous"
            />
        </div>
    );
};

export default CameraScanner;
