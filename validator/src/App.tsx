import React, { useState } from 'react';
import verifyHash from "./code";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [outputMessage, setOutputMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleVerify = async () => {
    if (!file) {
      setOutputMessage('Please upload a file.');
      return;
    }

    setOutputMessage('Computing hash...');
    const hash = await computeFileHash(file);
    const hashWithPrefix = '0x' + hash;

    // Debugging: Log the computed hash
    console.log('Computed Hash:', hashWithPrefix); // <-- Debugging line (Remove this line after debugging)

    setOutputMessage('Verifying...');
    const isValid = await verifyHash(hashWithPrefix);
    setOutputMessage(isValid ? 'Hash is valid!' : 'Hash is not valid.');
  };

  // Function to compute SHA-256 hash
  const computeFileHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); 
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Debugging: Print the generated hash to console (Remove this line after debugging)
    console.log('Generated SHA-256 hash:', hashHex); // <-- Debugging line

    return hashHex;
  };

  return (
    <div className="App">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
      />
      <button id="verifyButton" onClick={handleVerify}>Verify Hash</button>
      <div id="output">{outputMessage}</div>
    </div>
  );
}

export default App;
