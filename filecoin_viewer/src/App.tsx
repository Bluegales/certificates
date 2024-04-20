import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getFiles } from './get_cids';
import lighthouse from '@lighthouse-web3/sdk';
import './App.css';

interface Element {
  name: string;
  cid: string;
}

const App: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  const checkMetaMaskInstallation = useCallback(() => {
    const hasMetaMask = typeof window.ethereum !== 'undefined';
    setIsMetaMaskAvailable(hasMetaMask);
    return hasMetaMask;
  }, []);

  const fetchElements = useCallback(async () => {
    if (!checkMetaMaskInstallation()) {
      console.error('MetaMask is not installed');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      const address = await signer.getAddress();
      const data = await getFiles(address);
      setElements(data);
    } catch (error) {
      console.error('Error fetching elements:', error);
    }
  }, [checkMetaMaskInstallation]);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  const encryptionSignature = async () => {
    if (!isMetaMaskAvailable) {
      console.error('MetaMask is not installed');
      return { signedMessage: null, publicKey: null };
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage,
      publicKey: address
    };
  };

  const decrypt = async (cid: string) => {
    const { publicKey, signedMessage } = await encryptionSignature();
    if (!publicKey || !signedMessage) {
      console.error('Failed to get public key or signed message');
      return;
    }
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );
    const fileType = "application/pdf";
    const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key as string, fileType);

    const url = URL.createObjectURL(decrypted);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certificate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (cid: string) => {
    try {
      console.log(`Downloading element with CID: ${cid}`);
      await decrypt(cid);
      console.log(`Download of element with CID ${cid} successful`);
    } catch (error) {
      console.error(`Error downloading element with CID ${cid}:`, error);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        {/* Content on the left */}
        {isMetaMaskAvailable ? (
          <div className="elements-list">
            {elements.map((element) => (
              <div key={element.cid} className="element-item">
                <span className="element-name">{element.name}</span>
                <button className="download-button" onClick={() => handleDownload(element.cid)}>Download</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="metamask-message">MetaMask is required to interact with this application. Please install MetaMask and reload the page.</p>
        )}
      </div>
      <div className="right-section">
        {/* Logo and text on the right */}
        <img src="/logo.png" width="300" alt="logo" />
        <div className="verification-process">
          <h2>Download your Signed Certificates from Filecoin</h2>
          <p>Authenticate using Metamask. Page might need to be refreshed once</p>
        </div>
      </div>
    </div>
  );
};

export default App;