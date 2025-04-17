// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Analyzing your medical report...</p>
      <p className="loading-note">This may take a few moments depending on the size and complexity of your report.</p>
    </div>
  );
};

export default LoadingSpinner;