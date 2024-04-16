import React, { useState, useCallback } from 'react';
import verifyHash from "./code";
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [outputMessage, setOutputMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleVerify = async () => {
    if (!file) {
      setOutputMessage('Please upload a file.');
      return;
    }

    setOutputMessage('Computing hash...');
    const hash = await computeFileHash(file);
    const hashWithPrefix = '0x' + hash;

    console.log('Computed Hash:', hashWithPrefix); // Debugging line
    setOutputMessage('Verifying...');
    const isValid = await verifyHash(hashWithPrefix);
    setOutputMessage(isValid ? 'Hash is valid!' : 'Hash is not valid.');
  };

  const computeFileHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Generated SHA-256 hash:', hashHex); // Debugging line
    return hashHex;
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="upload-container">
          <h2>Upload Certificate</h2>
          <p>Upload a Student Certificate to validate its content and legitimacy using cryptography and on-chain data.</p>
          <div className="file-upload-box" onDrop={onDrop} onDragOver={onDragOver}>
            <span className="upload-icon"><img src="upload.ico" alt="Upload Icon" /></span>
            <p id="file-info">Drag & drop file here or <span className="browse-link" onClick={() => document.getElementById('file-input')?.click()}>Browse</span></p>
            <input type="file" id="file-input" hidden onChange={handleFileChange} accept=".pdf" />
          </div>
          <button id="validate-button" onClick={handleVerify}>Validate Now</button>
          <p id="feedback-message">{outputMessage}</p>
        </div>
      </div>
      <div className="right-section">
        <div className="verification-process">
          <div className="document-icon">
            <img src="document.png" width="300" alt="Document" />
          </div>
          <h1>Verify authenticity of Student certificates.</h1>
          <p>Simply upload the .pdf you received and get instant feedback if the file is legit.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
