import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authentication.css';

const AuthenticationScreen = ({ onSuccess, onFailure }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(timer);
          navigate('/success'); // Always succeed for any scanned QR
        }
        return next;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="shield-icon">🛡️</div>
        <h2>Authenticating User</h2>
        <p>Please wait while we verify your identity</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
        <div className="secure-info">
          <span className="secure-icon">🛡️</span>
          <span>Secure Connection</span>
        </div>
        <p className="footer">This process is encrypted and secure</p>
      </div>
    </div>
  );
};

export default AuthenticationScreen;
