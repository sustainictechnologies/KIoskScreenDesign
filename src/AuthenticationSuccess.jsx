import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './authentication.css';

const AuthenticationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin');
    }, 2000); // Redirect after 2 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="success-icon">✅</div>
        <h2>Authentication Successful</h2>
        <p>Identity verified successfully</p>
        <p>• Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default AuthenticationSuccess;
