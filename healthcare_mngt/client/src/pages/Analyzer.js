import React, { useState } from 'react';
import Layout from '../components/Layout';
import FileUpload from '../components/FileUpload';
import ReportAnalysis from '../components/ReportAnalysis';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeReportLocally } from '../components/utils/localAnalyzer';
import { extractTextFromDoc } from '../components/utils/docExtractor';
import '../styles/Analyzer.css';

const Analyzer = () => {
  const [fileContent, setFileContent] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeReport = async (content) => {
    if (!content) {
      setError('No content to analyze');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      let extractedText;
      
      // Handle different file types
      if (typeof content === 'string') {
        // Plain text
        extractedText = content;
      } else {
        // Object with data and type properties
        const { data, type } = content;
        
        if (type === 'text/plain') {
          extractedText = data;
        } else if (type === 'application/msword' || 
                  type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          extractedText = await extractTextFromDoc(data);
        } else if (type.startsWith('image/')) {
          // For images, we'd need OCR
          // In a real app, you'd integrate with a service like Tesseract.js or a cloud OCR API
          setError('Image analysis requires OCR integration. This feature is not implemented in this demo.');
          setIsLoading(false);
          return;
        } else {
          throw new Error('Unsupported file type');
        }
      }
      
      console.log("📝 Extracted text for analysis:", extractedText.substring(0, 100) + "...");
      
      if (!extractedText || extractedText.trim() === "") {
        throw new Error('No text could be extracted from the file');
      }
  
      // Analyze the extracted text
      setTimeout(() => {
        const analysisText = analyzeReportLocally(extractedText);
        console.log("✅ Generated Report:", analysisText);
        setAnalysis(analysisText);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      console.error('❌ Error analyzing report:', err);
      setError(err.message || 'An error occurred while analyzing the report');
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="analyzer-container">
        <div className="analyzer-header">
          <h1>Medical Report Analyzer</h1>
          <p>Upload your medical report to get a simplified analysis</p>
        </div>
        
        <div className="analyzer-content">
          {!analysis && !isLoading && (
            <FileUpload 
              setFileContent={setFileContent} 
              analyzeReport={analyzeReport}
            />
          )}
          
          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="error-container">
              <h2>Error</h2>
              <p>{error}</p>
              <button onClick={() => setError(null)}>Try Again</button>
            </div>
          )}
          
          {analysis && !isLoading && (
            <ReportAnalysis 
              analysis={analysis}
              onReset={() => {
                setAnalysis(null);
                setFileContent(null);
              }}
            />
          )}
        </div>
        
        <div className="analyzer-footer">
          <p>Note: This tool is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Analyzer;