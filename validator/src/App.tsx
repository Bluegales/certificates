import React, { useState, useCallback } from 'react';
import verifyHash from "./code";
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [outputMessage, setOutputMessage] = useState('');
  const [filename, setFilename] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isValidHash, setIsValidHash] = useState(false);
  const [loading, setLoading] = useState(false);  // State to manage loading modal visibility

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      setFilename(event.dataTransfer.files[0].name);
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

    setLoading(true); // Show loading modal
    setOutputMessage('Computing hash...');
    const hash = await computeFileHash(file);
    const hashWithPrefix = '0x' + hash;

    console.log('Computed Hash:', hashWithPrefix);
    const valid = await verifyHash(hashWithPrefix);
    setIsValidHash(!!valid);  // Coerce to boolean primitive
    setShowModal(true); // Show the modal with the result
    setLoading(false); // Hide loading modal
    setOutputMessage(''); // Clear the computing message
  };

  const computeFileHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Generated SHA-256 hash:', hashHex);
    return hashHex;
  };

  const Modal = () => (
    <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Verification Result</h2>
        <p style={{ fontSize: 24, color: isValidHash ? 'green' : 'red' }}>
          {isValidHash ? 'Valid ✅' : 'Invalid ❌'}
        </p>
        <button onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  );

  const LoadingModal = () => (
    <div className="modal-background">
        <div className="loader"></div>
    </div>
  );

  return (
    <div className="container">
        <div className="left-section">
            <div className="upload-container">
                <h2>Upload Certificate</h2>
                <p>Upload a Student Certificate to validate its content and legitimacy using cryptography and on-chain data.</p>
                <div className="file-upload-box" onDrop={onDrop} onDragOver={onDragOver}>
                    <span className="upload-icon"><img src="upload.ico" alt="Upload Icon" /></span>
                    <div className="file-info">
                        {filename ? <div>{filename}</div> : <div>Drag & drop file here</div>}
                        <div className="browse-link" onClick={() => document.getElementById('file-input')?.click()}>Browse</div>
                    </div>
                    <input type="file" id="file-input" hidden onChange={handleFileChange} accept=".pdf" />
                </div>
                <button id="validate-button" onClick={handleVerify}>Validate Now</button>
                <p id="feedback-message">{outputMessage}</p>
            </div>
        </div>
        <div className="right-section">
            <div className="verification-process">
                <div className="document-icon">
                    <img src="/document.png" width="300" alt="Document" />
                </div>
                <h1>Verify authenticity of Student certificates.</h1>
                <p>Simply upload the .pdf you received and get instant feedback if the file is legit.</p>
            </div>
        </div>
        {loading && <LoadingModal />}
        {showModal && <Modal />}
    </div>
);
}

export default App;
