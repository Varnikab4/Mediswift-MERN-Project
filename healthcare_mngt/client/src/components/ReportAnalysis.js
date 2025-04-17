import React, { useState } from 'react';
import '../App.css';


const ReportAnalysis = ({ analysis, onReset, onDownloadDocx, isDownloading }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Parse the analysis text into structured data
  const parseAnalysis = () => {
    const result = {
      patientDetails: [],
      keyParameters: [],
      abnormalFindings: [],
      recommendations: []
    };
    
    // Split the analysis into sections
    const sections = analysis.split('\n\n');
    
    sections.forEach(section => {
      if (section.includes('Patient Details:-')) {
        const lines = section.split('\n').slice(1); // Skip the heading
        result.patientDetails = lines.filter(line => line.startsWith('- ')).map(line => {
          const [key, value] = line.substring(2).split(': ');
          return { key, value };
        });
      } else if (section.includes('Key Health Parameters:-')) {
        const lines = section.split('\n').slice(1); // Skip the heading
        result.keyParameters = lines.filter(line => line.startsWith('- ')).map(line => {
          let [param, value] = line.substring(2).split(': ');
          if (!value) {
            // Handle case where format might be different
            const parts = param.split(' ');
            value = parts.pop();
            param = parts.join(' ');
          }
          return { param, value };
        });
      } else if (section.includes('Abnormal Findings:-')) {
        const lines = section.split('\n').slice(1); // Skip the heading
        result.abnormalFindings = lines
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2));
      } else if (section.includes('Recommendations:-')) {
        const lines = section.split('\n').slice(1); // Skip the heading
        result.recommendations = lines
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2));
      }
    });
    
    return result;
  };
  
  const { patientDetails, keyParameters, abnormalFindings, recommendations } = parseAnalysis();
  
  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>Report Analysis</h2>
        <div className="analysis-actions">
          <button 
            className="copy-button"
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button 
            className="reset-button"
            onClick={onReset}
          >
            Analyze Another Report
          </button>
        </div>
      </div>
      
      <div className="analysis-content">
        {/* Patient Details Section */}
        {patientDetails.length > 0 && (
          <div className="analysis-section">
            <h2>Patient Details</h2>
            <div className="patient-info">
              {patientDetails.map((detail, index) => (
                <div key={index} className="patient-info-item">
                  <span className="patient-info-label">{detail.key}</span>
                  <span className="patient-info-value">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Key Health Parameters Section */}
        <div className="analysis-section">
          <h2>Key Health Parameters</h2>
          {keyParameters.length > 0 ? (
            <table className="key-parameters-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {keyParameters.map((param, index) => (
                  <tr key={index}>
                    <td className="parameter-name">{param.param}</td>
                    <td className="parameter-value">{param.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No specific health parameters detected.</p>
          )}
        </div>
        
        {/* Abnormal Findings Section */}
        <div className="analysis-section">
          <h2>Abnormal Findings</h2>
          {abnormalFindings.length > 0 ? (
            <div className="abnormal-findings">
              <ul>
                {abnormalFindings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No abnormal results detected.</p>
          )}
        </div>
        
        {/* Recommendations Section */}
        <div className="analysis-section">
          <h2>Recommendations</h2>
          {recommendations.length > 0 ? (
            <div className="recommendations">
              <ul>
                {recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No specific recommendations mentioned.</p>
          )}
        </div>
        
        {/* Note Section */}
        <div className="analysis-note">
          This is an automated analysis. Please consult a medical professional for accurate interpretation.
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;