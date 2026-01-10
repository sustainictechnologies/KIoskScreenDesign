
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QRBarcodeScanner = ({
  timeoutMs = 20000,  // auto-fail if nothing detected in this time
  singleScan = true,  // stop after first successful scan
}) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [supported, setSupported] = useState({
    barcodeDetector: false,
    torch: false,
  });

  useEffect(() => {
    let animReq;
    let scanTimer;
    let detector;
    let canvas;

    const STREAM_URL = process.env.REACT_APP_STREAM_URL;
    const hasBarcodeDetector = 'BarcodeDetector' in window;
    setSupported(prev => ({ ...prev, barcodeDetector: hasBarcodeDetector }));

    const startStream = async () => {
      try {
        // Attach network stream to video element (MJPEG or other stream)
        if (videoRef.current) {
          videoRef.current.crossOrigin = 'anonymous';
          videoRef.current.src = STREAM_URL;
          // Some MJPEG streams don't autoplay; try play and ignore promise rejection
          const p = videoRef.current.play();
          if (p && p.catch) p.catch(() => {});
        }

        // Prepare detector
        if (hasBarcodeDetector) {
          detector = new window.BarcodeDetector({
            formats: [
              'qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8',
              'upc_a', 'upc_e', 'itf', 'pdf417', 'aztec', 'data_matrix',
            ],
          });
        }

        // Create an offscreen canvas for frame capture
        canvas = document.createElement('canvas');

        // Start overlay animation
        animateOverlay();

        // Start scanning loop
        setIsScanning(true);
        scanLoop();

        // Timeout -> error popup
        scanTimer = setTimeout(() => {
          if (isScanning) {
            setError('Scan timed out. Make sure the camera stream is reachable and code is visible.');
            setIsScanning(false);
          }
        }, timeoutMs);
      } catch (e) {
        setError('Unable to load stream. Check the stream URL and network connectivity.');
        setIsScanning(false);
      }

      async function scanLoop() {
        if (!videoRef.current || !isScanning) return;
        try {
          // Draw current frame into canvas for detection
          const v = videoRef.current;
          const w = v.videoWidth || v.clientWidth || 640;
          const h = v.videoHeight || v.clientHeight || 480;
          if (w && h) {
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
            }
            const ctx = canvas.getContext('2d');
            try { ctx.drawImage(v, 0, 0, w, h); } catch (e) { /* drawing may fail until stream ready */ }

            if (detector) {
              const results = await detector.detect(canvas);
              if (results && results.length > 0) {
                pulseSuccess();
                if (singleScan) setIsScanning(false);
                navigate('/auth');
                return;
              }
            }
          }
        } catch (err) {
          // Non-fatal; keep scanning
        }
        animReq = requestAnimationFrame(scanLoop);
      }

      function animateOverlay() {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const scanLine = overlay.querySelector('.scan-line');
        const frame = overlay.querySelector('.scan-frame');
        let y = 0;
        let dir = 1;

        const step = () => {
          if (!frame || !scanLine) return;
          const rect = frame.getBoundingClientRect();
          const height = rect.height;
          y += dir * 2.2;
          if (y > height - 4) dir = -1;
          if (y < 0) dir = 1;
          scanLine.style.transform = `translateY(${y}px)`;
          animReq = requestAnimationFrame(step);
        };
        animReq = requestAnimationFrame(step);
      }

      function pulseSuccess() {
        const overlay = overlayRef.current;
        if (!overlay) return;
        overlay.classList.add('success-pulse');
        setTimeout(() => overlay.classList.remove('success-pulse'), 450);
      }
    };

    startStream();

    return () => {
      cancelAnimationFrame(animReq);
      clearTimeout(scanTimer);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismissError = () => {
    setError('');
    setIsScanning(true);
  };

  const toggleTorch = () => setTorchOn(v => !v);

  return (
    <div className="scanner-page">
      <header className="scanner-header">
        <h2>Scan your code</h2>
        <p className="hint">Place your code inside the frame. Avoid glare and keep steady.</p>
      </header>

      <div className="scanner-container">
        {/* <video ref={videoRef} className="video" playsInline muted /> */}
<img src='http://10.42.0.148:81/stream'></img>
        {/* Overlay UI */}
        <div ref={overlayRef} className="overlay">
          <div className="scan-frame">
            <div className="corners">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
            </div>
            <div className="scan-line" />
            <div className="scan-icon" aria-hidden="true">⌁</div>
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="btn secondary" onClick={() => navigate('/')}>Go back</button>

        <div className="spacer" />
        {/* Test button for simulation */}
        <button
          className="btn test-scan"
          onClick={() => navigate('/auth')}
          title="Simulate successful scan for testing"
        >
          Test Scan
        </button>
      </div>

      {/* Error popup on failure */}
      {error && (
        <div className="popup-backdrop" role="dialog" aria-modal="true">
          <div className="popup">
            <h3>Scan failed</h3>
            <p>{error}</p>
            <ul className="tips">
              <li>Align the code fully inside the frame.</li>
              <li>Increase lighting or enable torch.</li>
              <li>Reduce screen glare and reflections.</li>
              <li>Try a slightly greater distance.</li>
            </ul>
            <div className="popup-actions">
              <button className="btn secondary" onClick={() => navigate('/')}>Return to start</button>
              <button className="btn" onClick={handleDismissError}>Try again</button>
            </div>
          </div>
        </div>
      )}

      {/* Capability notice */}
      {!supported.barcodeDetector && (
        <div className="capability-note">
          Your browser doesn’t support in-built barcode detection. Scanning may be limited.
        </div>
      )}
    </div>
  );
};

export default QRBarcodeScanner;
