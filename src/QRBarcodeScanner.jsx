
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
    let stream;
    let scanTimer;
    let animReq;
    let detector;

    const hasBarcodeDetector = 'BarcodeDetector' in window;
    setSupported(prev => ({ ...prev, barcodeDetector: hasBarcodeDetector }));

    const startCamera = async () => {
      try {
        // Enumerate cameras
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const cams = mediaDevices.filter(d => d.kind === 'videoinput');
        setDevices(cams);
        const preferredId = deviceId || (cams[0]?.deviceId ?? undefined);

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: preferredId ? { exact: preferredId } : undefined,
            facingMode: preferredId ? undefined : { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            focusMode: 'continuous',
            // Torch hint; actual control is via track.applyConstraints
            advanced: [{ torch: torchOn }],
          },
          audio: false,
        });

        // Torch support detection
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities ? track.getCapabilities() : {};
        setSupported(prev => ({ ...prev, torch: !!capabilities.torch }));

        // Apply torch constraint if supported
        if (torchOn && capabilities.torch) {
          await track.applyConstraints({ advanced: [{ torch: true }] });
        }

        // Attach stream to video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
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

        // Start overlay animation
        animateOverlay();

        // Start scanning loop
        setIsScanning(true);
        scanLoop();

        // Timeout -> error popup
        scanTimer = setTimeout(() => {
          if (isScanning) {
            setError('Scan timed out. Make sure the code is well-lit and aligned inside the frame.');
            setIsScanning(false);
          }
        }, timeoutMs);
      } catch (e) {
        setError('Camera access failed. Please allow camera permission or try another device.');
        setIsScanning(false);
      }

      async function scanLoop() {
        if (!videoRef.current || !isScanning) return;
        try {
          let results = [];
          if (detector) {
            results = await detector.detect(videoRef.current);
          }
          // Fallback idea: We could capture a frame to canvas and try a JS decoder,
          // but to keep it lightweight, we rely on BarcodeDetector when available.
          if (results && results.length > 0) {
            const text = results[0].rawValue || results[0].format || 'SCANNED';
            pulseSuccess();
            if (singleScan) setIsScanning(false);
            navigate('/auth');
            return;
          }
        } catch {
          // Non-fatal; keep scanning
        }
        requestAnimationFrame(scanLoop);
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
          y += dir * 2.2; // speed in px per frame
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

    startCamera();

    return () => {
      cancelAnimationFrame(animReq);
      clearTimeout(scanTimer);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, torchOn]);

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
        <video ref={videoRef} className="video" playsInline muted />

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

        <select
          className="select"
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
          aria-label="Camera"
        >
          <option value="">Default camera</option>
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 6)}`}</option>
          ))}
        </select>

        <button
          className="btn"
          onClick={toggleTorch}
          disabled={!supported.torch}
          title={supported.torch ? 'Toggle flashlight' : 'Torch not supported'}
        >
          {torchOn ? 'Torch: On' : 'Torch: Off'}
        </button>

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
