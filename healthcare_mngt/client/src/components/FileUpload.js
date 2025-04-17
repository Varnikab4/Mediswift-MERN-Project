import React, { useState } from 'react';

const FileUpload = ({ setFileContent, analyzeReport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file) => {
    setSelectedFile(file);
    setUploadError(null);
    
    // Check if file type is supported - removed PDF
    const validTypes = [
      'image/jpeg', 
      'image/png', 
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a DOC, DOCX, image (JPEG/PNG), or text file');
      setSelectedFile(null);
      setFileType(null);
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit');
      setSelectedFile(null);
      setFileType(null);
      return;
    }
    
    setFileType(file.type);
    setFileContent(null); // Reset any previous content
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }
    
    setIsProcessing(true);
    setUploadError(null);
    
    try {
      const reader = new FileReader();
      
      const readFilePromise = new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
      });
      
      // Reading as appropriate format based on file type
      if (fileType === 'text/plain') {
        reader.readAsText(selectedFile);
      } else {
        // For DOCs and images, read as data URL
        reader.readAsDataURL(selectedFile);
      }
      
      const result = await readFilePromise;
      
      const fileContent = {
        data: result,
        type: fileType,
        name: selectedFile.name
      };
      
      setFileContent(fileContent);
      analyzeReport(fileContent);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError(`Error processing file: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-upload" 
          onChange={handleChange}
          accept=".jpg,.jpeg,.png,.txt,.doc,.docx"
          className="file-input" 
          disabled={isProcessing}
        />
        <label htmlFor="file-upload" className="file-label">
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p>Drag and drop your medical report here or click to browse</p>
          <p className="file-types">Supported formats: DOC, DOCX, TXT</p>
          <p className="file-size">Maximum file size: 10MB</p>
        </label>
      </div>
      
      {uploadError && (
        <div className="upload-error">
          <p>{uploadError}</p>
        </div>
      )}
      
      {selectedFile && (
        <div className="selected-file">
          <p>Selected file: {selectedFile.name}</p>
          <button 
            className="analyze-button"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Analyze Report'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;