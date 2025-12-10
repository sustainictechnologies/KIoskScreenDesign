import React from 'react';
import './authentication.css';

const AuthenticationResult = ({ success, onReturn }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {success ? (
          <>
            <div className="shield-icon" style={{ color: 'green' }}>✅</div>
            <h2>Authentication Successful</h2>
            <p>Identity verified successfully</p>
            <p>• Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <div className="shield-icon" style={{ color: 'red' }}>❌</div>
            <h2>Authentication Failed</h2>
            <p>We couldn't verify your identity. Please scan your code again.</p>
            <div className="error-box">
              Invalid credentials or expired session
            </div>
            <button className="btn" onClick={onReturn}>Return to Start Page</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthenticationResult;
