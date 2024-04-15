import React, { useState } from 'react';
import verifyHash from "./code";

function App() {
  const [hash, setHash] = useState('');
  const [outputMessage, setOutputMessage] = useState('');

  const handleVerify = async () => {
    if (!hash) {
      setOutputMessage('Please enter a hash.');
      return;
    }

    setOutputMessage('Verifying...');
    const isValid = await verifyHash(hash);
    setOutputMessage(isValid ? 'Hash is valid!' : 'Hash is not valid.');
  };

  return (
    <div className="App">
      <input
        type="text"
        id="hashInput"
        placeholder="Enter hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <button id="verifyButton" onClick={handleVerify}>Verify Hash</button>
      <div id="output">{outputMessage}</div>
    </div>
  );
}

export default App;
